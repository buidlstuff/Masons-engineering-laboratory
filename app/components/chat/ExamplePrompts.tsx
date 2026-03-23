import React from 'react';

interface ExamplePromptsProps {
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
}

const EXAMPLE_PROMPTS = [
  { text: 'Build a physics sandbox where I drop objects and they bounce, roll, and collide realistically' },
  { text: 'Create a bridge builder: I place beams between points, then test if my bridge holds a truck' },
  { text: 'Make a circuit simulator with batteries, resistors, LEDs and wires I can connect together' },
  { text: 'Build a 3D solar system I can rotate and zoom into, with real planet sizes and orbit speeds' },
  { text: 'Create a robot arm simulator where I control each joint with sliders and pick up objects' },
  { text: 'Make a gear train calculator: I set gear sizes and it shows how speed and torque change' },
  { text: 'Build a marble run designer where I place ramps, loops and funnels then watch the marble go' },
  { text: 'Create a simple rocket launch simulator with adjustable thrust, angle, and fuel amount' },
];

export function ExamplePrompts({ sendMessage }: ExamplePromptsProps) {
  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-6">
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
          <button
            key={index}
            onClick={(event) => {
              sendMessage?.(event, examplePrompt.text);
            }}
            className="border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-bolt-elements-background-depth-1 dark:hover:bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary px-3 py-1 text-xs transition-theme"
          >
            {examplePrompt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
