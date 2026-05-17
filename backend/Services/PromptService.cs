namespace PomodoroApi.Services;

public class PromptService(string template)
{
    public string Build(string userInput) => template.Replace("{{USER_INPUT}}", userInput);
}
