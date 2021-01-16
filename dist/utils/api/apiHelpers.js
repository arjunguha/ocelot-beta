"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = exports.validEmailSession = exports.successResponse = exports.failureResponse = exports.isFailureResponse = void 0;
const secrets_1 = require("../../secrets");
exports.isFailureResponse = (arg) => arg.status === 'FAILURE';
exports.failureResponse = (message) => ({
    status: 'FAILURE',
    data: { message: message }
});
exports.successResponse = (data) => ({
    status: 'SUCCESS',
    data: data
});
exports.validEmailSession = () => {
    return localStorage.getItem('userEmail') !== null &&
        localStorage.getItem('sessionId') !== null;
};
exports.getUrl = (path) => {
    return `${secrets_1.CLD_FN_BASE_URL}${path}`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpSGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9hcGkvYXBpSGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBZ0Q7QUFvQm5DLFFBQUEsaUJBQWlCLEdBQUcsQ0FBQyxHQUFnQixFQUEwQixFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUM7QUFFM0YsUUFBQSxlQUFlLEdBQUcsQ0FBQyxPQUFlLEVBQW1CLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7Q0FDN0IsQ0FBQyxDQUFDO0FBRVUsUUFBQSxlQUFlLEdBQUcsQ0FBSSxJQUFPLEVBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLElBQUksRUFBRSxJQUFJO0NBQ2IsQ0FBQyxDQUFDO0FBRVUsUUFBQSxpQkFBaUIsR0FBRyxHQUFZLEVBQUU7SUFDM0MsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUk7UUFDekMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLENBQUM7QUFDdkQsQ0FBQyxDQUFDO0FBRVcsUUFBQSxNQUFNLEdBQUcsQ0FBQyxJQUFZLEVBQVUsRUFBRTtJQUMzQyxPQUFPLEdBQUcseUJBQWUsR0FBRyxJQUFJLEVBQUUsQ0FBQztBQUN2QyxDQUFDLENBQUMifQ==