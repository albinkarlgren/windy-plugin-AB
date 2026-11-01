const __pluginConfig =  {
  "name": "windy-plugin-aurora-botnia",
  "version": "1.0.0",
  "icon": "⛴️",
  "title": "Aurora Botnia",
  "description": "Live tracking of Aurora Botnia via Digitraffic",
  "author": "albinkarlgren",
  "desktopUI": "rhpane",
  "mobileUI": "small",
  "desktopWidth": 260,
  "routerPath": "/aurora-botnia",
  "private": true,
  "built": 1793544921696,
  "builtReadable": "2026-11-01T14:55:21.696Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const config = {
    title: 'Aurora Botnia'};

/* src/plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-u6swcv", ".status.svelte-u6swcv{margin:12px 0 18px;line-height:1.45}.name.svelte-u6swcv{font-weight:700;font-size:1.15em;margin-bottom:6px}.row.svelte-u6swcv{margin:2px 0}.small.svelte-u6swcv{font-size:0.85em;opacity:0.8;margin-top:6px}.muted.svelte-u6swcv{opacity:0.6;font-size:0.78em}.error.svelte-u6swcv{color:#ff6b6b}.loading.svelte-u6swcv{opacity:0.7}.controls.svelte-u6swcv{display:flex;flex-direction:column;gap:10px;margin-bottom:12px}.auto.svelte-u6swcv{display:flex;align-items:center;gap:6px;font-size:0.9em}.aurora-botnia-icon{background:transparent !important;border:none !important}");
}

// (14:22) 
function create_if_block_2(ctx) {
	let div0;
	let t1;
	let div1;
	let t2;
	let b0;
	let t3_value = /*pos*/ ctx[3].speed.toFixed(1) + "";
	let t3;
	let t4;
	let t5;
	let div2;
	let t6;
	let b1;
	let t7_value = Math.round(/*pos*/ ctx[3].course) + "";
	let t7;
	let t8;
	let t9;
	let div3;
	let t10;
	let b2;
	let t11_value = /*pos*/ ctx[3].heading + "";
	let t11;
	let t12;
	let t13;
	let div4;
	let t14;
	let b3;
	let t15;
	let t16;
	let div5;
	let t17_value = /*pos*/ ctx[3].lat.toFixed(5) + "";
	let t17;
	let t18;
	let t19_value = /*pos*/ ctx[3].lon.toFixed(5) + "";
	let t19;
	let t20;
	let div6;

	return {
		c() {
			div0 = element("div");
			div0.textContent = "AURORA BOTNIA";
			t1 = space();
			div1 = element("div");
			t2 = text("Speed: ");
			b0 = element("b");
			t3 = text(t3_value);
			t4 = text(" kn");
			t5 = space();
			div2 = element("div");
			t6 = text("Course: ");
			b1 = element("b");
			t7 = text(t7_value);
			t8 = text("°");
			t9 = space();
			div3 = element("div");
			t10 = text("Heading: ");
			b2 = element("b");
			t11 = text(t11_value);
			t12 = text("°");
			t13 = space();
			div4 = element("div");
			t14 = text("Updated: ");
			b3 = element("b");
			t15 = text(/*lastUpdate*/ ctx[4]);
			t16 = space();
			div5 = element("div");
			t17 = text(t17_value);
			t18 = text(", ");
			t19 = text(t19_value);
			t20 = space();
			div6 = element("div");
			div6.textContent = "Source: Digitraffic";
			attr(div0, "class", "name svelte-u6swcv");
			attr(div1, "class", "row svelte-u6swcv");
			attr(div2, "class", "row svelte-u6swcv");
			attr(div3, "class", "row svelte-u6swcv");
			attr(div4, "class", "row svelte-u6swcv");
			attr(div5, "class", "row small svelte-u6swcv");
			attr(div6, "class", "row small muted svelte-u6swcv");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			append(div1, t2);
			append(div1, b0);
			append(b0, t3);
			append(b0, t4);
			insert(target, t5, anchor);
			insert(target, div2, anchor);
			append(div2, t6);
			append(div2, b1);
			append(b1, t7);
			append(b1, t8);
			insert(target, t9, anchor);
			insert(target, div3, anchor);
			append(div3, t10);
			append(div3, b2);
			append(b2, t11);
			append(b2, t12);
			insert(target, t13, anchor);
			insert(target, div4, anchor);
			append(div4, t14);
			append(div4, b3);
			append(b3, t15);
			insert(target, t16, anchor);
			insert(target, div5, anchor);
			append(div5, t17);
			append(div5, t18);
			append(div5, t19);
			insert(target, t20, anchor);
			insert(target, div6, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*pos*/ 8 && t3_value !== (t3_value = /*pos*/ ctx[3].speed.toFixed(1) + "")) set_data(t3, t3_value);
			if (dirty & /*pos*/ 8 && t7_value !== (t7_value = Math.round(/*pos*/ ctx[3].course) + "")) set_data(t7, t7_value);
			if (dirty & /*pos*/ 8 && t11_value !== (t11_value = /*pos*/ ctx[3].heading + "")) set_data(t11, t11_value);
			if (dirty & /*lastUpdate*/ 16) set_data(t15, /*lastUpdate*/ ctx[4]);
			if (dirty & /*pos*/ 8 && t17_value !== (t17_value = /*pos*/ ctx[3].lat.toFixed(5) + "")) set_data(t17, t17_value);
			if (dirty & /*pos*/ 8 && t19_value !== (t19_value = /*pos*/ ctx[3].lon.toFixed(5) + "")) set_data(t19, t19_value);
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
				detach(t5);
				detach(div2);
				detach(t9);
				detach(div3);
				detach(t13);
				detach(div4);
				detach(t16);
				detach(div5);
				detach(t20);
				detach(div6);
			}
		}
	};
}

// (12:24) 
function create_if_block_1(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*error*/ ctx[2]);
			attr(div, "class", "error svelte-u6swcv");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*error*/ 4) set_data(t, /*error*/ ctx[2]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (10:8) {#if loading}
function create_if_block(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "Fetching position…";
			attr(div, "class", "loading svelte-u6swcv");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function create_fragment(ctx) {
	let section;
	let div0;
	let t1;
	let div1;
	let t2;
	let div2;
	let button;
	let t4;
	let label0;
	let input0;
	let t5;
	let t6;
	let label1;
	let input1;
	let t7;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*loading*/ ctx[1]) return create_if_block;
		if (/*error*/ ctx[2]) return create_if_block_1;
		if (/*pos*/ ctx[3]) return create_if_block_2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	return {
		c() {
			section = element("section");
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[6]}`;
			t1 = space();
			div1 = element("div");
			if (if_block) if_block.c();
			t2 = space();
			div2 = element("div");
			button = element("button");
			button.textContent = "Refresh now";
			t4 = space();
			label0 = element("label");
			input0 = element("input");
			t5 = text("\n            Auto-refresh every 60 s");
			t6 = space();
			label1 = element("label");
			input1 = element("input");
			t7 = text("\n            Keep map centered");
			attr(div0, "class", "plugin__title plugin__title--chevron-back");
			attr(div1, "class", "status svelte-u6swcv");
			attr(button, "class", "button button--primary size-s");
			attr(input0, "type", "checkbox");
			attr(label0, "class", "auto svelte-u6swcv");
			attr(input1, "type", "checkbox");
			attr(label1, "class", "auto svelte-u6swcv");
			attr(div2, "class", "controls svelte-u6swcv");
			attr(section, "class", "plugin__content");
		},
		m(target, anchor) {
			insert(target, section, anchor);
			append(section, div0);
			append(section, t1);
			append(section, div1);
			if (if_block) if_block.m(div1, null);
			append(section, t2);
			append(section, div2);
			append(div2, button);
			append(div2, t4);
			append(div2, label0);
			append(label0, input0);
			input0.checked = /*autoRefresh*/ ctx[0];
			append(label0, t5);
			append(div2, t6);
			append(div2, label1);
			append(label1, input1);
			input1.checked = /*followShip*/ ctx[5];
			append(label1, t7);

			if (!mounted) {
				dispose = [
					listen(div0, "click", /*click_handler*/ ctx[9]),
					listen(button, "click", /*refresh*/ ctx[7]),
					listen(input0, "change", /*input0_change_handler*/ ctx[10]),
					listen(input1, "change", /*input1_change_handler*/ ctx[11])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}

			if (dirty & /*autoRefresh*/ 1) {
				input0.checked = /*autoRefresh*/ ctx[0];
			}

			if (dirty & /*followShip*/ 32) {
				input1.checked = /*followShip*/ ctx[5];
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(section);
			}

			if (if_block) {
				if_block.d();
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

const MMSI = 230040000;

function instance($$self, $$props, $$invalidate) {
	const { title } = config;
	const ENDPOINT = `https://meri.digitraffic.fi/api/ais/v1/locations?mmsi=${MMSI}`;
	let loading = true;
	let error = null;
	let pos = null;
	let lastUpdate = '';
	let autoRefresh = true;
	let followShip = true;
	let timer = null;
	let marker = null;
	let trail = null;
	const trailPoints = [];

	const boatIcon = L.divIcon({
		html: `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.784,13.635c0,0 -0.106,-2.924 0.006,-4.379c0.115,-1.502 0.318,-3.151 0.686,-4.632c0.163,-0.654 0.45,-1.623 0.755,-2.44c0.202,-0.54 0.407,-1.021 0.554,-1.352c0.038,-0.085 0.122,-0.139 0.215,-0.139c0.092,0 0.176,0.054 0.214,0.139c0.151,0.342 0.361,0.835 0.555,1.352c0.305,0.817 0.592,1.786 0.755,2.44c0.368,1.481 0.571,3.13 0.686,4.632c0.112,1.455 0.006,4.379 0.006,4.379l-4.432,0Z" style="fill:#0b5fff;"/>
            <path d="M5.481,12.731c0,0 -0.073,-3.048 0.003,-4.22c0.06,-0.909 0.886,-3.522 1.293,-4.764c0.03,-0.098 0.121,-0.165 0.223,-0.165c0.103,0 0.193,0.067 0.224,0.164c0.406,1.243 1.232,3.856 1.292,4.765c0.076,1.172 0.003,4.22 0.003,4.22l-3.038,0Z" style="fill:#fff;fill-opacity:0.85;"/>
        </svg>`,
		iconSize: [28, 28],
		iconAnchor: [14, 14],
		className: 'aurora-botnia-icon'
	});

	function updateRotation() {
		if (!marker?._icon || !pos) return;
		const icon = marker._icon;
		icon.style.transformOrigin = '14px 14px';
		const t = icon.style.transform || '';

		if (!t.includes('rotateZ')) {
			icon.style.transform = `${t} rotateZ(${pos.heading}deg)`;
		} else {
			icon.style.transform = t.replace(/rotateZ\([^)]+\)/, `rotateZ(${pos.heading}deg)`);
		}
	}

	function setMarker(lat, lon) {
		const latlng = [lat, lon];

		if (!marker) {
			marker = L.marker(latlng, { icon: boatIcon }).addTo(map);
		} else {
			marker.setLatLng(latlng);
		}

		trailPoints.push(latlng);
		if (trailPoints.length > 40) trailPoints.shift();

		if (trail) {
			trail.setLatLngs(trailPoints);
		} else {
			trail = L.polyline(trailPoints, {
				color: '#0b5fff',
				weight: 3,
				opacity: 0.75
			}).addTo(map);
		}

		if (followShip || trailPoints.length === 1) {
			map.setView(latlng, Math.max(map.getZoom(), 9));
		}

		updateRotation();
	}

	async function fetchPosition() {
		$$invalidate(1, loading = true);
		$$invalidate(2, error = null);

		try {
			const res = await fetch(ENDPOINT, {
				headers: {
					'Digitraffic-User': 'WindyPlugin-AuroraBotnia/1.0',
					Accept: 'application/json'
				},
				cache: 'no-store'
			});

			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			if (!data.features?.length) throw new Error('No position available');
			const f = data.features[0];
			const [lon, lat] = f.geometry.coordinates;
			const p = f.properties;

			$$invalidate(3, pos = {
				lat,
				lon,
				speed: p.sog ?? 0,
				course: p.cog ?? 0,
				heading: p.heading ?? p.cog ?? 0,
				timestamp: p.timestampExternal ?? Date.now()
			});

			$$invalidate(4, lastUpdate = new Date(pos.timestamp).toLocaleString());
			setMarker(pos.lat, pos.lon);
		} catch(e) {
			$$invalidate(2, error = e.message || 'Failed to fetch');
			console.error(e);
		} finally {
			$$invalidate(1, loading = false);
		}
	}

	const refresh = () => fetchPosition();

	function startAuto() {
		stopAuto();
		if (autoRefresh) timer = setInterval(fetchPosition, 60000);
	}

	function stopAuto() {
		if (timer) clearInterval(timer);
		timer = null;
	}

	const onopen = () => {
		fetchPosition();
		startAuto();
	};

	onMount(() => {
		map.on('zoom', updateRotation);
		map.on('zoomend', updateRotation);
		map.on('viewreset', updateRotation);
	});

	onDestroy(() => {
		stopAuto();
		if (marker) map.removeLayer(marker);
		if (trail) map.removeLayer(trail);
		map.off('zoom', updateRotation);
		map.off('zoomend', updateRotation);
		map.off('viewreset', updateRotation);
	});

	const click_handler = () => bcast.emit('rqstOpen', 'menu');

	function input0_change_handler() {
		autoRefresh = this.checked;
		$$invalidate(0, autoRefresh);
	}

	function input1_change_handler() {
		followShip = this.checked;
		$$invalidate(5, followShip);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*autoRefresh*/ 1) {
			if (autoRefresh) startAuto(); else stopAuto();
		}
	};

	return [
		autoRefresh,
		loading,
		error,
		pos,
		lastUpdate,
		followShip,
		title,
		refresh,
		onopen,
		click_handler,
		input0_change_handler,
		input1_change_handler
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 8 }, add_css);
	}

	get onopen() {
		return this.$$.ctx[8];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
