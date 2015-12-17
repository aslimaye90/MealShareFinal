/**
 * Created by Karuna on 10/27/2015.
 */
function store() {

    this.meals = [

        new meal(
            "tandoori-paneer-tikka",
            "Paneer Tikka",
            "This is a north indian cheese dish made with tomato and basil",
            "Indian",
        "Cottage Cheese, Bell Peppers, Milk, Spices",
        "Milk",
        "9",
        "Sunnyvale",
            "Shruti"),
        new meal(
            "chana_curry",
            "Chana curry",
            "This is a north indian garbanzo  dish made with tomato and and various spices",
            "Indian",
            "Grabanzo beans, Tomatoes, Milk, Spices",
            "Milk",
            "7",
            "San Jose",
        "Nidhi"),
        new meal(
            "fishcurry",
            "Fish Curry",
            "This is a  indian fish curry made with aromatic spices",
            "Indian",
            "Fish, Spices",
            "Fish",
            "14",
            "San Mateo",
            "Sunny"),
        new meal(
            "thai-vegi-curry",
            "Thai Veg Curry",
            "This is a Thai main course dish made with vegetables and basil",
            "Thai",
            "Tofu, Bell Peppers, Coconut Milk, Spices",
            "Coconut Milk",
            "10",
            "Redwood City",
            "Rohit")

    ];

}

store.prototype.getmeal = function (sku) {
    for (var i = 0; i < this.meals.length; i++) {
        if (this.meals[i].sku == sku)
            return this.meals[i];
    }
    return null;
};