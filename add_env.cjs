const { spawn } = require('child_process');

function addEnv(key, value) {
  return new Promise((resolve, reject) => {
    console.log(`Adding ${key}...`);
    const child = spawn('vercel', ['env', 'add', key, 'production'], { shell: true });
    
    child.stdout.on('data', d => console.log(d.toString()));
    child.stderr.on('data', d => console.error(d.toString()));
    
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(`Exited with ${code}`);
    });

    // Write the value to stdin
    child.stdin.write(value + '\n');
    child.stdin.end();
  });
}

async function run() {
  try {
    await addEnv('STRIPE_SECRET_KEY', 'sk_test_...<YOUR_STRIPE_SECRET_KEY>');
    await addEnv('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_test_...<YOUR_STRIPE_PUBLISHABLE_KEY>');
    console.log("Environment variables added successfully!");
  } catch (e) {
    console.error("Failed:", e);
  }
}

run();
