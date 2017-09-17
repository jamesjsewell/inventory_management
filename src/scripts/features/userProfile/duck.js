import { combineReducers } from "redux";
import { createStructuredSelector } from "reselect";
import _ from "underscore";
import axios from "axios";
import {
	API_URL,
	fetchUser,
	postData,
	getData,
	putData,
	deleteData,
	getAPIkey,
	getToken
} from "../../util/index.js";
const GET_USER_PROFILE = "get_user_profile",
	UPDATE_USER_PROFILE = "update_user_profile",
	UPLOAD_PROFILE_IMAGE = "upload_profile_image";

import filestack from "filestack-js";

// actions
export { getAPIkey };

export function fetchUserProfile(uid) {
	return function(dispatch) {
		axios
			.get(`${API_URL}/user/profile/${uid}`, {
				headers: { Authorization: getToken() }
			})
			.then(response => {
				dispatch({
					type: GET_USER_PROFILE,
					payload: response.data
				});
			})
			.catch(error => {
				console.log("error");
			});
	};
}

export function updatePersonalInfo(userId, updatedInfo) {
	return function(dispatch) {
		dispatch({
			type: UPDATE_USER_PROFILE,
			payload: {
				updating: true,
				success: undefined,
				error: undefined
			}
		});

		putData(
			UPDATE_USER_PROFILE,
			{ success: false },
			true,
			`/user/profile/${userId}`,
			dispatch,
			updatedInfo,
			{ updating: false, success: true, error: undefined }
		);

		dispatch({
			type: UPLOAD_PROFILE_IMAGE,
			payload: {
				status: "in action",
				success: undefined,
				failure: undefined,
				url: undefined
			}
		});
	};
}

export function resetStatusOfUpdate() {
	return function(dispatch) {
		dispatch({
			type: UPDATE_USER_PROFILE,
			payload: {
				success: undefined
			}
		});
	};
}

export function uploadProfileImage(apiKey) {
	return function(dispatch) {
		dispatch({
			type: UPLOAD_PROFILE_IMAGE,
			payload: {
				status: "in action",
				success: undefined,
				failure: undefined,
				url: undefined
			}
		});

		const client = filestack.init(apiKey);

		client
			.pick({
				accept: ["image/*"],
				maxSize: 2 * 1024 * 1024,
				transformations: {
					crop: { aspectRatio: 1 / 1, circle: true },
					minDimensions: [200, 200]
				}
			})
			.then(function(result) {
				var theJson = JSON.parse(JSON.stringify(result.filesUploaded));
				var theUrl = theJson[0].url;
				if (theUrl) {
					dispatch({
						type: UPLOAD_PROFILE_IMAGE,
						payload: {
							status: "complete",
							success: true,
							failure: false,
							url: theUrl
						}
					});
				} else {
					dispatch({
						type: UPLOAD_PROFILE_IMAGE,
						payload: {
							status: "failure",
							success: false,
							failure: true,
							url: undefined
						}
					});
				}
			});
	};
}

// reducers

const init_user_profile = {
	username: undefined,
	profile: undefined,
	message: "",
	updatingProfile: undefined,
	updateProfileSuccess: undefined,
	updateProfileError: undefined,
	receivedUrl: undefined,
	statusOfUpload: undefined,
	uploadSuccess: undefined,
	uploadFailure: undefined,
	user: undefined
};

function userProfileReducer(state = init_user_profile, action) {
	switch (action.type) {
		case GET_USER_PROFILE:
			return _.extend({}, state, {
				profile: action.payload.user.profile,
				username: action.payload.user.username
			});
		case UPDATE_USER_PROFILE:
			return _.extend({}, state, {
				username: action.payload.username,
				profile: action.payload.profile,
				updatingProfile: action.payload.updating,
				updateProfileSuccess: action.payload.success,
				updateProfileError: action.payload.error
			});

		case UPLOAD_PROFILE_IMAGE:
			return _.extend({}, state, {
				statusOfUpload: action.payload.status,
				uploadSuccess: action.payload.success,
				uploadFailure: action.payload.failure,
				receivedUrl: action.payload.url
			});
	}

	return state;
}

export default combineReducers({
	userProfile: userProfileReducer
});

// selectors

const user = state => state.auth.userSession.user,
	profile = state => state.editProfile.userProfile.profile,
	username = state => state.editProfile.userProfile.username,
	updatingProfile = state => state.editProfile.userProfile.updatingProfile,
	updated = state => state.editProfile.userProfile.updateProfileSuccess,
	errorUpdating = state => state.editProfile.userProfile.updateProfileError,
	receivedImgUrl = state => state.editProfile.userProfile.receivedUrl,
	filestackApiKey = state => state.util.apiKeys.filestackApiKey;

export const selector = createStructuredSelector({
	user,
	profile,
	username,
	updatingProfile,
	updated,
	errorUpdating,
	receivedImgUrl,
	filestackApiKey
});
