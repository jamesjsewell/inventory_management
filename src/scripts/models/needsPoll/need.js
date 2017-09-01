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
	model: NeedModel,
	url: "/api/needsPoll/needs"
});
