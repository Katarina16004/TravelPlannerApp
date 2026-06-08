using Common.Events;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Interfaces
{
    public interface IEmailService : IService
    {
        public Task PublishEvent(EmailEvent emailEvent);
    }
}
