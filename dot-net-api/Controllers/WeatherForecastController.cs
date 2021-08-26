using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using CardCounterApi.Models;
namespace dot_net_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        { 
            // try
            // {
            //     var connString = "mongodb://127.0.0.1:27017";
            //     MongoClient client = new MongoClient(connString);
            //     var DB = client.GetDatabase("CardCounter");
            //     // List all the MongoDB databases
            //     string cards = "cards";
            //     var c = DB.GetCollection<Card>(cards);
            //     var theFilter = Builders<BsonDocument>.Filter.Eq("Name", "delirium");
            //     var d = c.Find(new BsonDocument()).ToList();
            //     return d;
            // }
            // catch (Exception ex)
            // {
                // Console.WriteLine("Error:" + ex.Message);
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
            
        }
    }
}
