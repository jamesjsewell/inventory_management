import Backbone from "backbone";

export const UserModel = Backbone.Model.extend({
	urlRoot: "/api/user",
	idAttribute: "_id"
});

export const CollectionOfUsers = Backbone.Collection.extend({
	comparator: function(mod) {
		return new Date(mod.get("createdAt")).getTime() * -1;
	},
	fetch: function(options) {
		console.log(options)
		if (options.data) {
			options.url = "/api/user/" + options.data;
			delete options.data;
		}
		Backbone.Collection.prototype.fetch.call(this, options);
	},
	model: UserModel
});
