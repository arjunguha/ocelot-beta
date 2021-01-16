"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubGist = void 0;
const apiHelpers_1 = require("./apiHelpers");
exports.getGithubGist = (gistID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://gist.githubusercontent.com/${gistID}/raw`);
        if (response.status !== 200) {
            return apiHelpers_1.failureResponse('Cannot load Github gist');
        }
        return apiHelpers_1.successResponse({
            code: yield response.text()
        });
    }
    catch (error) {
        return apiHelpers_1.failureResponse('Error loading Github gist');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R2l0aHViR2lzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9hcGkvZ2V0R2l0aHViR2lzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw2Q0FLc0I7QUFJVCxRQUFBLGFBQWEsR0FBRyxDQUFPLE1BQWMsRUFBK0IsRUFBRTtJQUVqRixJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsc0NBQXNDLE1BQU0sTUFBTSxDQUFDLENBQUM7UUFFakYsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtZQUMzQixPQUFPLDRCQUFlLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNuRDtRQUVELE9BQU8sNEJBQWUsQ0FBQztZQUNyQixJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFO1NBQzVCLENBQUMsQ0FBQztLQUVKO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLDRCQUFlLENBQUMsMkJBQTJCLENBQUMsQ0FBQztLQUNyRDtBQUNILENBQUMsQ0FBQSxDQUFDIn0=