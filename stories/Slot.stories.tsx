import React from 'react';
import { Meta, Story } from '@storybook/react';
import { PropsWithSlots, useSlot } from '../src';

function Text({ body }: { body: string }) {
  return <p>{body}</p>;
}

function TextContainer({
  text,
}: PropsWithSlots<
  {},
  {
    text: {
      component: typeof Text;
      shorthand: string | React.ReactElement;
      optional: false;
    };
  }
>) {
  const renderText = useSlot(Text, text, {
    primitiveRemap: 'body',
    defaultProps: { body: 'haha' },
  });
  return <div>{renderText()}</div>;
}

function Test() {
  return (
    <TextContainer
      text={{
        body: 'test',
        children: (Component, props) => <Component {...props} />,
      }}
    />
  );
}

const meta: Meta = {
  title: 'Slot',
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<React.ComponentProps<typeof TextContainer>> = (args) => (
  <TextContainer {...args} />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  text: {
    body: 'This is using prop text!',
  },
};

export const ShorthandString = Template.bind({});
ShorthandString.args = {
  text: 'This is using shorthand text!',
};

export const ShorthandReactElement = Template.bind({});
ShorthandReactElement.args = {
  text: <i>Italic</i>,
};
