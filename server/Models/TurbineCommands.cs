public interface ITurbineCommand
{
    string action { get; }
}

public static class TurbineCommands
{
    public class SetInterval : ITurbineCommand
    {
        public string action { get; set; } = "setInterval";
        public int value { get; set; }
    }

    public class Stop : ITurbineCommand
    {
        public string action { get; set; } = "stop";
        public string? reason { get; set; }
    }

    public class Start : ITurbineCommand
    {
        public string action { get; set; } = "start";
    }

    public class SetPitch : ITurbineCommand
    {
        public string action { get; set; } = "setPitch";
        public double angle { get; set; }
    }
}