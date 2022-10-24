import React from 'react';

export type PrimitiveShorthand =
  | number
  | string
  | boolean
  | React.ReactElement
  | never;

export type SlotsType = Record<
  string,
  {
    component: React.ComponentType<any>;
    shorthand: PrimitiveShorthand;
    optional: true | false;
  }
>;

export interface RenderPropsSlot<C extends React.ComponentType<any>> {
  children: (Component: C, props: React.ComponentProps<C>) => React.ReactNode;
}

function isRenderProps<C extends React.ComponentType<any>>(
  props: any
): props is RenderPropsSlot<C> {
  return props.children != null && typeof props.children === 'function';
}

export type PropsWithSlots<Props, Slots extends SlotsType> = Props &
  {
    [Property in keyof Slots]: Slots[Property]['optional'] extends true
      ?
          | RenderPropsSlot<Slots[Property]['component']>
          | (React.ComponentProps<Slots[Property]['component']> &
              Partial<RenderPropsSlot<Slots[Property]['component']>>)
          | Slots[Property]['shorthand']
          | null
          | undefined
      :
          | RenderPropsSlot<Slots[Property]['component']>
          | (React.ComponentProps<Slots[Property]['component']> &
              Partial<RenderPropsSlot<Slots[Property]['component']>>)
          | Slots[Property]['shorthand']
          | null;
  };

function Text() {
  return <p></p>;
}

export type Test = PropsWithSlots<
  {},
  {
    text?: {
      component: typeof Text;
      shorthand: React.ReactElement;
      optional: true;
    };
  }
>;

const test: Test = {};

export function useSlot<Component extends React.ComponentType<any>>(
  component: Component,
  props:
    | RenderPropsSlot<Component>
    | (React.ComponentProps<Component> & Partial<RenderPropsSlot<Component>>)
    | PrimitiveShorthand
    | null
    | undefined,
  options: {
    primitiveRemap:
      | keyof React.ComponentProps<Component>
      | 'display'
      | 'replace';
    defaultProps: React.ComponentProps<Component>;
  }
): () => React.ReactNode {
  if (props === null) {
    return () => null;
  }
  let appliedProps: React.ComponentProps<Component>;
  if (
    typeof props === 'string' ||
    typeof props === 'number' ||
    typeof props === 'boolean' ||
    React.isValidElement(props)
  ) {
    if (options.primitiveRemap === 'display') {
      if (props === false) {
        return () => {
          return null;
        };
      } else {
        appliedProps = options.defaultProps;
      }
    } else if (options.primitiveRemap === 'replace') {
      return () => {
        return props;
      };
    } else {
      appliedProps = {
        [options.primitiveRemap]: props,
      } as React.ComponentProps<Component>;
    }
  } else if (isRenderProps<Component>(props)) {
    const { children, ...restProps } = props;
    return () => {
      return props.children(
        component,
        restProps as React.ComponentProps<Component>
      );
    };
  } else if (props === undefined) {
    appliedProps = options.defaultProps;
  } else {
    appliedProps = props;
  }
  const Component = component;
  return () => {
    return <Component {...appliedProps} />;
  };
}
