import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';

describe('App.vue', () => {
  it('renders without crashing', () => {
    const wrapper = mount(App, {
      global: {
        stubs: ['router-view', 'Header'],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'router-view' }).exists()).toBe(true);
  });
});
