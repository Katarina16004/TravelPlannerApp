import React, { useState } from 'react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

import { tripService } from '../../services/Trip/tripService'; 
import { expenseService } from '../../services/Trip/Expense/expenseService';
import { checklistService } from '../../services/Trip/Checklist/checklistService';
import { destinationService } from '../../services/Trip/Destination/destinationService';
import { activityService } from '../../services/Trip/Activity/activityService';
import { travelTheme } from '../../theme/Theme';

const DownloadTripPdfButton = ({ tripId, token }) => {
    const [pdfLoading, setPdfLoading] = useState(false);

    const handleDownloadPDF = async () => {
        try {
            setPdfLoading(true);

            const tripRes = await tripService.getTripById(tripId).catch(() => null);
            const destRes = await destinationService.getTripDestinations(tripId, token).catch(() => null);
            const expensesRes = await expenseService.getTripExpenses(tripId, token).catch(() => null);
            const checklistRes = await checklistService.getTripChecklist(tripId, token).catch(() => null);

            const tripData = tripRes?.data || {};
            const destinations = destRes?.data || [];
            const expenses = expensesRes?.data || [];
            const checklist = checklistRes?.data || [];

            let allActivities = [];
            for (const dest of destinations) {
                const destId = dest.id || dest.Id;
                try {
                    const actRes = await activityService.getDestinationActivities(destId, token);
                    if (actRes?.data) {
                        const mapped = actRes.data.map(act => ({
                            ...act,
                            destinationName: dest.name || dest.Name
                        }));
                        allActivities = [...allActivities, ...mapped];
                    }
                } catch (e) {
                    console.error(`Greška za aktivnosti destinacije ${destId}:`, e);
                }
            }

            const doc = new jsPDF();
            let currentY = 20;

            doc.setFont("Helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(26, 54, 93);
            doc.text((tripData.name || tripData.Name || "TRAVEL ITINERARY").toUpperCase(), 14, currentY);
            
            doc.setFontSize(10);
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            
            const sDate = tripData.startDate || tripData.StartDate;
            const eDate = tripData.endDate || tripData.EndDate;
            const datesText = sDate && eDate 
                ? `Period: ${new Date(sDate).toLocaleDateString()} - ${new Date(eDate).toLocaleDateString()}` 
                : "Period: N/A";
            
            doc.text(datesText, 14, currentY + 7);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, currentY + 12);
            
            const descriptionText = tripData.description || tripData.Description;
            if (descriptionText) {
                doc.setFont("Helvetica", "italic");
                doc.text(`Description: ${descriptionText}`, 14, currentY + 18);
                currentY += 6;
            }

            doc.setDrawColor(220, 220, 220);
            doc.line(14, currentY + 16, 196, currentY + 16);
            currentY += 26;

            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.setTextColor(26, 54, 93);
            doc.text("1. Destinations", 14, currentY);
            currentY += 6;

            if (destinations.length > 0) {
                const destRows = destinations.map((d, index) => [
                    index + 1,
                    d.name || d.Name || 'N/A',
                    d.location || d.Location || 'N/A',
                    d.arrivalDate ? new Date(d.arrivalDate).toLocaleDateString() : 'N/A',
                    d.departureDate ? new Date(d.departureDate).toLocaleDateString() : 'N/A'
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['#', 'Destination Name', 'Location', 'Arrival', 'Departure']],
                    body: destRows,
                    theme: 'striped',
                    headStyles: { fillColor: [43, 108, 176] },
                    margin: { left: 14, right: 14 }
                });
                currentY = doc.lastAutoTable.finalY + 15;
            } else {
                doc.setFontSize(10);
                doc.setFont("Helvetica", "italic");
                doc.text("No destinations added to this trip.", 14, currentY + 4);
                currentY += 15;
            }

            if (currentY > 240) { doc.addPage(); currentY = 20; }
            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.setTextColor(26, 54, 93);
            doc.text("2. Activities Schedule", 14, currentY);
            currentY += 6;

            if (allActivities.length > 0) {
                const actRows = allActivities.map(act => [
                    act.name || act.Name || 'N/A',
                    act.destinationName || 'General',
                    act.location || act.Location || 'N/A',
                    act.startTime ? new Date(act.startTime).toLocaleString() : 'N/A',
                    act.cost ? `${act.cost} EUR` : '0 EUR'
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['Activity', 'Destination', 'Location', 'Start Time', 'Cost']],
                    body: actRows,
                    theme: 'striped',
                    headStyles: { fillColor: [49, 151, 149] },
                    margin: { left: 14, right: 14 }
                });
                currentY = doc.lastAutoTable.finalY + 15;
            } else {
                doc.setFontSize(10);
                doc.setFont("Helvetica", "italic");
                doc.text("No activities found for this trip.", 14, currentY + 4);
                currentY += 15;
            }

            if (currentY > 240) { doc.addPage(); currentY = 20; }
            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.setTextColor(26, 54, 93);
            doc.text("3. Expenses Log", 14, currentY);
            currentY += 6;

            if (expenses.length > 0) {
                let total = 0;
                const expenseRows = expenses.map(exp => {
                    const amt = parseFloat(exp.amount || exp.Amount || 0);
                    total += amt;
                    return [
                        exp.title || exp.Title || 'N/A',
                        exp.category || exp.Category || 'General',
                        exp.date ? new Date(exp.date).toLocaleDateString() : 'N/A',
                        `${amt.toFixed(2)} ${exp.currency || 'EUR'}`
                    ];
                });

                expenseRows.push([
                    { content: 'Total Expenses:', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } }, 
                    `${total.toFixed(2)} EUR`
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['Title', 'Category', 'Date', 'Amount']],
                    body: expenseRows,
                    theme: 'grid',
                    headStyles: { fillColor: [224, 86, 36] },
                    margin: { left: 14, right: 14 }
                });
                currentY = doc.lastAutoTable.finalY + 15;
            } else {
                doc.setFontSize(10);
                doc.setFont("Helvetica", "italic");
                doc.text("No expenses recorded.", 14, currentY + 4);
                currentY += 15;
            }

            if (currentY > 240) { doc.addPage(); currentY = 20; }
            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.setTextColor(26, 54, 93);
            doc.text("4. Checklist Items", 14, currentY);
            currentY += 6;

            if (checklist.length > 0) {
                const checklistRows = checklist.map(item => [
                    item.title || item.Title || 'N/A',
                    item.isCompleted || item.IsCompleted ? 'Done' : 'Pending'
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['Item / Task', 'Status']],
                    body: checklistRows,
                    theme: 'striped',
                    headStyles: { fillColor: [74, 85, 104] },
                    margin: { left: 14, right: 14 }
                });
            } else {
                doc.setFontSize(10);
                doc.setFont("Helvetica", "italic");
                doc.text("Checklist is empty.", 14, currentY + 4);
            }

            doc.save(`Trip_Report_${tripId}.pdf`);
            toast.success("PDF generated successfully!");

        } catch (error) {
            console.error(error);
            toast.error("Error generating PDF. Please try again.");
        } finally {
            setPdfLoading(false);
        }
    };

    return (
        <button 
            onClick={handleDownloadPDF} 
            disabled={pdfLoading}
            style={{
                padding: '10px 20px',
                backgroundColor: '#2fb344',
                color: 'white',
                border: 'none',
                borderRadius: travelTheme?.radius?.regular || '4px',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: pdfLoading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
        >
            {pdfLoading ? 'Generating...' : 'Download PDF'}
        </button>
    );
};

export default DownloadTripPdfButton;