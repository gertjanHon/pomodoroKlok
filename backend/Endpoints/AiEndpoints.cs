using OpenAI.Chat;
using PomodoroApi.Services;

namespace PomodoroApi.Endpoints;

public static class AiEndpoints
{
    public static void MapAiEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/check", (ApiConfig config) =>
            Results.Ok(new { success = !string.IsNullOrEmpty(config.OpenAiApiKey) })
        ).WithName("ApiCheck");

        group.MapPost("/generate-plan", async (GoalRequest req, ChatClient client, PromptService prompts) =>
        {
            var prompt = prompts.Build(req.Goal);
            ChatCompletion completion = await client.CompleteChatAsync(new UserChatMessage(prompt));
            return Results.Ok(new { plan = completion.Content[0].Text });
        }).WithName("GeneratePlan");
    }
}

record GoalRequest(string Goal);
