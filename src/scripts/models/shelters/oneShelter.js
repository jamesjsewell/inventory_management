import Backbone from "backbone";

export const ItemModel = Backbone.Model.extend({
	urlRoot: "/api/sheltersFeature/shelters",
	idAttribute: "_id"
});

export const CollectionOfOneItem = Backbone.Collection.extend({
	comparator: function(mod) {
		return new Date(mod.get("createdAt")).getTime() * -1;
	},
	fetch: function(options) {
		
		if (options.data) {
			options.url = "/api/sheltersFeature/shelters/" + options.data
		 	delete options.data
		 	Backbone.Collection.prototype.fetch.call(this, options);
		}
		
	},
	model: ItemModel
});