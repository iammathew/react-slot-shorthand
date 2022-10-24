import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSlot, PropsWithSlots } from '../src';

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

function TextContainerOptional({
  text,
}: PropsWithSlots<
  {},
  {
    text: {
      component: typeof Text;
      shorthand: string | React.ReactElement | undefined;
      optional: true;
    };
  }
>) {
  const renderText = useSlot(Text, text, {
    primitiveRemap: 'body',
    defaultProps: { body: 'Default Text' },
  });
  return <div>{renderText()}</div>;
}

function TextContainerDisplay({
  text,
}: PropsWithSlots<
  {},
  { text: { component: typeof Text; shorthand: boolean; optional: false } }
>) {
  const renderText = useSlot(Text, text, {
    primitiveRemap: 'display',
    defaultProps: { body: 'Default Text' },
  });
  return <div>{renderText()}</div>;
}

function TextContainerReplace({
  text,
}: PropsWithSlots<
  {},
  {
    text: {
      component: typeof Text;
      shorthand: React.ReactElement;
      optional: false;
    };
  }
>) {
  const renderText = useSlot(Text, text, {
    primitiveRemap: 'replace',
    defaultProps: { body: 'Default props!' },
  });
  return <div>{renderText()}</div>;
}

describe('Slot TextContainer[body]', () => {
  it('renders correctly (string shorthand)', () => {
    const result = render(<TextContainer text="String Shorthand!" />);
    expect(result.getByText('String Shorthand!')).toBeInTheDocument();
    expect(result.container.firstChild).toMatchSnapshot();
  });

  it('renders correctly (react element shorthand)', () => {
    const result = render(<TextContainer text={<i>Element Shorthand!</i>} />);
    expect(result.getByText('Element Shorthand!')).toBeInTheDocument();
    expect(result.container.firstChild).toMatchSnapshot();
  });

  it('renders correctly (props)', () => {
    const result = render(<TextContainer text={{ body: 'Props used!' }} />);
    expect(result.getByText('Props used!')).toBeInTheDocument();
    expect(result.container.firstChild).toMatchSnapshot();
  });

  it('renders correctly (null)', () => {
    const result = render(<TextContainer text={null} />);
    expect(result.container.firstChild).toMatchSnapshot();
  });
});

describe('Slot TextContainerOptional[body]', () => {
  it('renders correctly (not defined)', () => {
    const result = render(<TextContainerOptional />);
    expect(result.getByText('Default Text!')).toBeInTheDocument();
    expect(result.container.firstChild).toMatchSnapshot();
  });
});
