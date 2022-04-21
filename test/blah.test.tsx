import React from 'react';
import * as ReactDOM from 'react-dom';
import { useSlot, PropsWithSlots } from '../src';

describe('Slot', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.unmountComponentAtNode(div);
  });
});
