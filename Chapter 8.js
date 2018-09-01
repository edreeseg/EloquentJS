// Retry

class MultiplicatorUnitFailure extends Error {}

function reliableMultiply(a, b){
    for (;;){
        try {
            return primitiveMultiply(a, b);
        } catch(e) {
            if (e instanceof MultiplicatorUnitFailure) console.log("Multiplication Failure, try again!");
            else throw e;
        }
    }
}

// The Locked Box

const withBoxUnlocked = (f) => {
    if (!box.locked) return f();
    box.unlock();
    try {
        return f();    
    } finally {
        box.lock();
    }
}