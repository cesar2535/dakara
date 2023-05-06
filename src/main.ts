const Action = {
  UP: "up",
  DOWN: "down",
} as const;
type Action = (typeof Action)[keyof typeof Action];

async function main(action: Action) {
  console.log(action);
}

const actionArg = process.argv[2] as Action;

main(actionArg);
