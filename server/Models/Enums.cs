namespace server.Models;

public class Enums
{
    public enum AlertSeverity { Info, Warning, Critical }
    public enum CommandAction { Start, Stop, SetPitch, SetInterval }
    public enum CommandStatus { Accepted, Rejected, Failed }
    public enum TurbineStatus { Running, Stopped }
    public enum Role { Admin, Inspector, Operator}
}