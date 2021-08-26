using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Bson.Serialization;
namespace CardCounterApi.Models
{
    public class Card{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string _id {get; set;}
        public string Name {get; set;}
        public int Quantity {get; set;}
        public bool Foil {get; set;}
        public string Colors {get; set;}
        public string SaleValue {get; set;}
    }
}