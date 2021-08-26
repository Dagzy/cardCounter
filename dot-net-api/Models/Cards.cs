using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using CardCounterApi.Models;
namespace CardCounterApi.Models
{
    public class CardCollection{
        public List<Card> Cards = new List<Card>();
    }
}