"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs");
const RxOps = require("rxjs/operators");
const saveFileChanges_1 = require("./utils/api/saveFileChanges");
const state_1 = require("./state");
window.addEventListener('beforeunload', (event) => {
    if (state_1.dirty.getValue() === 'saved') {
        return null;
    }
    else {
        // NOTE(arjun): It does not appear to actually show this message.
        event.returnValue = `You may lose changes if you close the page.`;
        return true;
    }
});
function saveRequest() {
    state_1.dirty.next('saving');
    const p = state_1.currentProgram.getValue();
    if (p.kind !== 'program') {
        state_1.dirty.next('saved');
        return Rx.of(true);
    }
    const saveReq = saveFileChanges_1.saveChanges({
        fileName: p.name,
        type: 'create',
        changes: p.content
    });
    return Rx.from(saveReq)
        .pipe(RxOps.map(x => x.status === 'SUCCESS'));
}
state_1.dirty.pipe(RxOps.filter(x => x === 'dirty'), RxOps.debounceTime(1000), RxOps.mergeMap(saveRequest, 1))
    .subscribe(ok => {
    if (ok) {
        // Note that if there are other pending changes, then the buffer
        // may not be saved. However, the next save request, which fires
        // almost immediately, does isBufferSaved.next(false).
        state_1.dirty.next('saved');
    }
    else {
        // Suppress the notification if the browser is offline. Note that
        // we still try to save, even when the UA thinks we are offline.
        // I am not certain that online/offline detection is particularly
        // reliable, so it is not worth disabling saving when offline.
        if (navigator.onLine === false) {
            return;
        }
        state_1.notification.next({ message: `Failed to save file`, position: 'top' });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NhdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXV0b3NhdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBMkI7QUFDM0Isd0NBQXdDO0FBQ3hDLGlFQUEwRDtBQUMxRCxtQ0FBOEQ7QUFFOUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQzlDLElBQUksYUFBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLE9BQU8sRUFBRTtRQUM5QixPQUFPLElBQUksQ0FBQztLQUNmO1NBQU07UUFDSCxpRUFBaUU7UUFDakUsS0FBSyxDQUFDLFdBQVcsR0FBRyw2Q0FBNkMsQ0FBQztRQUNsRSxPQUFPLElBQUksQ0FBQztLQUNmO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLFdBQVc7SUFDaEIsYUFBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQixNQUFNLENBQUMsR0FBRyxzQkFBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDdEIsYUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEI7SUFFRCxNQUFNLE9BQU8sR0FBRyw2QkFBVyxDQUFDO1FBQ3hCLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSTtRQUNoQixJQUFJLEVBQUUsUUFBUTtRQUNkLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztLQUNyQixDQUFDLENBQUM7SUFFSCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFFRCxhQUFLLENBQUMsSUFBSSxDQUNOLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLEVBQ2hDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQ3hCLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzlCLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFO1FBQ0osZ0VBQWdFO1FBQ2hFLGdFQUFnRTtRQUNoRSxzREFBc0Q7UUFDdEQsYUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN2QjtTQUFNO1FBQ0gsaUVBQWlFO1FBQ2pFLGdFQUFnRTtRQUNoRSxpRUFBaUU7UUFDakUsOERBQThEO1FBQzlELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxLQUFLLEVBQUU7WUFDNUIsT0FBTztTQUNWO1FBQ0Qsb0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDMUU7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9