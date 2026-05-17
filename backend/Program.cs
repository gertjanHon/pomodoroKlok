using DotNetEnv;
using OpenAI.Chat;
using PomodoroApi.Endpoints;
using PomodoroApi.Services;

if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("OPENAI_API_KEY")))
    Env.TraversePath().Load();

var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddOpenApi();
builder.Services.AddSingleton(new ApiConfig(apiKey));

if (!string.IsNullOrEmpty(apiKey))
    builder.Services.AddSingleton(new ChatClient(model: "gpt-4o", apiKey: apiKey));

var promptTemplate = await File.ReadAllTextAsync("prompts/ProductivityCoach.txt");
builder.Services.AddSingleton(new PromptService(promptTemplate));

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors(p => p
    .WithOrigins("http://localhost:5173", "http://localhost:3000")
    .AllowAnyHeader()
    .AllowAnyMethod());

app.MapAiEndpoints();

app.Run();

record ApiConfig(string? OpenAiApiKey);
