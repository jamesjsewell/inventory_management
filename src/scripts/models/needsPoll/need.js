import Backbone from "backbone";

export const NeedModel = Backbone.Model.extend({
	urlRoot: "/api/needsPoll/needs",
	idAttribute: "_id",
	defaults: function() {
		return {
			nameOfNeed: null,
			postedBy: null,
			degreeOfNeed: 1
		};
	}
});

export const CollectionOfNeeds = Backbone.Collection.extend({
	comparator: function(mod) {
		return new Date(mod.get("createdAt")).getTime() * -1;
	},
	fetch: function(options) {
		
		if (options.data) {
			options.url = "/api/needsPoll/needs/" + options.data.currentShelter;
		 	delete options.data
		}
		Backbone.Collection.prototype.fetch.call(this, options);
	},
	model: NeedModel
});
