import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getActivityStatusColor } from '../../../enums/activityStatus';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ActivityCalendar = ({ activities, destinationStartDate, onEdit }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const events = activities.map(a => ({
        id: a.id || a.Id,
        title: a.name || a.Name,
        start: new Date(a.startTime || a.StartTime),
        end: new Date(a.endTime || a.EndTime),
        resource: a 
    }));

    useEffect(() => {
        if (destinationStartDate) {
            setCurrentDate(new Date(destinationStartDate));
        } else {
            setCurrentDate(new Date());
        }
    }, [destinationStartDate]); 

    const eventStyleGetter = (event) => {
        const status = event.resource?.status || event.resource?.Status;
        
        const backgroundColor = getActivityStatusColor(status);

        return {
            style: {
                backgroundColor: backgroundColor,
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white', 
                border: 'none',
                display: 'block'
            }
        };
    };

    return (
        <div style={{ height: '700px', backgroundColor: '#fff', borderRadius: '10px', padding: '10px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                defaultView="month"
                popup
                selectable
                toolbar={true}
                date={currentDate} 
                onNavigate={(newDate) => setCurrentDate(newDate)}

                eventPropGetter={eventStyleGetter}

                onSelectEvent={(event) => {
                    onEdit?.(event.resource);
                }}
                style={{ height: '100%' }}
            />
        </div>
    );
};

export default ActivityCalendar;