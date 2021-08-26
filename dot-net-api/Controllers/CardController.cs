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
    public class CardController : ControllerBase
    {
        private readonly ILogger<CardController> _logger;

        public CardController(ILogger<CardController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<BsonDocument> Get()
        { 
            try
            {
                var connString = "mongodb://127.0.0.1:27017";
                MongoClient client = new MongoClient(connString);
                var DB = client.GetDatabase("CardCounter");
                // List all the MongoDB databases
                string cards = "cards";
                var c = DB.GetCollection<Card>(cards);
                var theFilter = Builders<BsonDocument>.Filter.Eq("Name", "delirium");
                var d = c.Find(new BsonDocument()).Project("{_id:1}").ToList();
                Console.WriteLine(d);
                return d;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error:" + ex.Message);
                List<BsonDocument> p = new List<BsonDocument>();
                return p;
            }
        }
    }
}
