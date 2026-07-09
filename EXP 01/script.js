// External JavaScript File

function logEnvironmentInfo() {
    const envInfo = {
        "Browser Agent": navigator.userAgent,
        "Platform": navigator.platform,
        "Language": navigator.language,
        "Screen Resolution": `${window.screen.width}x${window.screen.height}`,
        "Window Inner Size": `${window.innerWidth}x${window.innerHeight}`,
        "Cookie Enabled": navigator.cookieEnabled
    };

    console.log("--- External JS: Logging Environment Info ---");
    // Demonstrate console.table()
    console.table(envInfo);

    // Demonstrate console.trace()
    console.log("--- External JS: Demonstrating console.trace() ---");
    traceExample();
}

function traceExample() {
    innerTrace();
}

function innerTrace() {
    console.trace("Trace of the environment logging process");
}

// Execute on load
logEnvironmentInfo();
