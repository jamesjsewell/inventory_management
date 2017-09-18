import Backbone from "backbone";

export const ItemModel = Backbone.Model.extend({
	urlRoot: "/api/sheltersFeature/shelters",
	idAttribute: "_id"
});

export const CollectionOfItems = Backbone.Collection.extend({
	comparator: function(mod) {
		return new Date(mod.get("createdAt")).getTime() * -1;
	},
	url: "/api/sheltersFeature/shelters",
	model: ItemModel
});
