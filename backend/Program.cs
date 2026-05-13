using DotNetEnv;
using OpenAI.Chat;

if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("OPENAI_API_KEY")))
    Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

builder.Services.AddOpenApi();

var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
    ?? throw new InvalidOperationException("OPENAI_API_KEY not set in environment or .env file.");

var app = builder.Build();



if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors(p => p
    .WithOrigins("http://localhost:5173", "http://localhost:3000")
    .AllowAnyHeader()
    .AllowAnyMethod());

app.MapPost("/api/generate-plan", async (GoalRequest req) =>
{
    var template = await File.ReadAllTextAsync("prompts/ProductivityCoach.txt");
    var prompt = template.Replace("{{USER_INPUT}}", req.Goal);
    var client = new ChatClient(model: "gpt-4o", apiKey: apiKey);
  
    ChatCompletion completion = await client.CompleteChatAsync(
        new UserChatMessage(prompt)
    );
    return Results.Ok(new { plan = completion.Content[0].Text });
})
.WithName("GeneratePlan");

app.Run();

record GoalRequest(string Goal);