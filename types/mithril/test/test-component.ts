import * as m from 'mithril';
import {Component, Comp} from 'mithril';

///////////////////////////////////////////////////////////
// 0.
// Simplest component example - no attrs or state.
//
const comp0 = {
	view() {
		return m('span', "Test");
	}
};

// Mount the component
m.mount(document.getElementById('comp0')!, comp0);

// Unmount the component
m.mount(document.getElementById('comp0')!, null);

///////////////////////////////////////////////////////////
// 1.
// Simple example. Vnode type for component methods is inferred.
//
const comp1: Component<{}, {}> = {
	oncreate({dom}) {
		// vnode.dom type inferred
	},
	view(vnode) {
		return m('span', "Test");
	}
};

///////////////////////////////////////////////////////////
// 2.
// Component with attrs
//
interface Comp2Attrs {
	title: string;
	description: string;
}

const comp2: Component<Comp2Attrs, {}> = {
	view({attrs: {title, description}}) { // Comp2Attrs type is inferred
		return [m('h2', title), m('p', description)];
	}
};

///////////////////////////////////////////////////////////
// 3.
// Declares attrs type inline.
// Uses comp2 with typed attrs and makes use of `onremove`
// lifecycle method.
//
const comp3: Component<{pageHead: string}, {}> = {
	oncreate({dom}) {
		// Can do stuff with dom
	},
	view({attrs}) {
		return m('.page',
			m('h1', attrs.pageHead),
			m(comp2,
				{
					// attrs is type checked - nice!
					title: "A Title",
					description: "Some descriptive text.",
					onremove(vnode) {
						console.log("comp2 was removed");
					},
				}
			),
			// Test other hyperscript parameter variations
			m(comp1, m(comp1)),
			m('br')
		);
	}
};

///////////////////////////////////////////////////////////
// 4.
// Typed attrs and state, and `this` type is inferred.
//
interface Comp4Attrs {
	name: string;
}

interface Comp4State {
	count: number;
	add(this: Comp4State, num: number): void;
}

// Either of these two Comp4 defs will work:
type Comp4 = Component<Comp4Attrs, Comp4State> & Comp4State;
// interface Comp4 extends Component<Comp4Attrs,Comp4State>, Comp4State {}

const comp4: Comp4 = {
	count: 0, // <- Must be declared to satisfy Comp4 type which includes Comp4State type
	add(num) {
		// num and this types inferred
		this.count += num;
	},
	oninit() {
		this.count = 0;
	},
	view({attrs}) {
		return [
			m('h1', `This ${attrs.name} has been clicked ${this.count} times`),
			m('button',
				{
					// 'this' is typed!
					onclick: () => this.add(1)
				},
			"Click me")
		];
	}
};

///////////////////////////////////////////////////////////
// 5.
// Stateful component (Equivalent to Comp4 example.)
// Avoids the use of `this` completely; state manipulated
// through vnode.state.
//
const comp5: Component<Comp4Attrs, Comp4State> = {
	oninit({state}) {
		state.count = 0;
		state.add = num => { state.count += num; };
	},
	view({attrs, state}) {
		return [
			m('h1', `This ${attrs.name} has been clicked ${state.count} times`),
			m('button',
				{
					onclick() { state.add(1); }
				},
				"Click me"
			)
		];
	}
};

///////////////////////////////////////////////////////////
//
// Concise module example with default export
//
interface Attrs {
	name: string;
}

interface State {
	count: number;
}

export default {
	count: 0,
	view({attrs}) {
		return m('span', `name: ${attrs.name}, count: ${this.count}`);
	}
} as Comp<Attrs, State>;
// Using the Comp type will apply the State intersection type for us.
