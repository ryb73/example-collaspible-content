"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicHeightCollapsibleContent = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var styled_1 = __importDefault(require("@emotion/styled"));
var Collapsible = __importStar(require("@radix-ui/react-collapsible"));
var react_1 = require("react");
var type_checks_1 = require("@ryb73/super-duper-parakeet/lib/src/type-checks");
var additionalStyleProps = {
    hasBeenOpen: true,
    prerender: true,
};
var makeStyledCollapsible = (0, styled_1.default)(Collapsible.Content, {
    shouldForwardProp: function (s) {
        return !Object.keys(additionalStyleProps).includes(s);
    },
});
var StyledCollapsibleContent = makeStyledCollapsible(
// Prerender the content so that radix can retrieve the height. Position it absolutely so that
// it doesn't affect the layout.
function (_a) {
    var prerender = _a.prerender;
    return prerender
        ? {
            position: "absolute",
            top: 0,
            visibility: "hidden",
            zIndex: -1,
        }
        : {};
}, 
// If the content is initially mounted but closed (i.e. forceMount is passed into
// DynamicHeightCollapsibleContent), we want the animation to act as if it's already happened
// (i.e. if there's an animation with animation-fill-mode forward where the height goes to 0,
//  the height should be rendered as 0 immediately rather than showing the animation).
// This is achieved by forcing the animation duration to 0 until the content is opened.
// "!important" is unfortunately required because (afaict) radix is using their own logic to set
// or unset the animation props. It kind of seems like they're trying to accomplish the same thing
// I'm doing here, except it's not working?
function (_a) {
    var hasBeenOpen = _a.hasBeenOpen;
    return !hasBeenOpen
        ? {
            animationDuration: "0s !important",
        }
        : {};
});
/** Mount Collapsible.Content to the page so that it gets dynamically sized before hiding. */
function DynamicHeightCollapsibleContent(_a) {
    var isOpen = _a.isOpen, props = __rest(_a, ["isOpen"]);
    var _b = (0, react_1.useState)(false), rendered = _b[0], setRendered = _b[1];
    var _c = (0, react_1.useState)(), elem = _c[0], setElem = _c[1];
    var handleRef = (0, react_1.useCallback)(function (e) { return setElem(e !== null && e !== void 0 ? e : undefined); }, []);
    var _d = (0, react_1.useState)(isOpen), hasBeenOpen = _d[0], setHasBeenOpen = _d[1];
    (0, react_1.useEffect)(function () {
        if (isOpen && !hasBeenOpen)
            setHasBeenOpen(true);
    }, [hasBeenOpen, isOpen]);
    (0, react_1.useEffect)(function () {
        if (rendered || !(0, type_checks_1.isDefined)(elem))
            return undefined;
        var interval = setInterval(function () {
            var heightValue = +getComputedStyle(elem)
                .getPropertyValue("--radix-collapsible-content-height")
                .replace(/px/gu, "");
            // In my testing, I never recorded an instance where the element is rendered but height isn't set.
            // Can't hurt to be safe here though, right?
            if (!Number.isNaN(heightValue) && heightValue > 0) {
                setRendered(true);
                clearInterval(interval);
            }
        }, 100);
        return function () { return clearInterval(interval); };
    }, [elem, rendered]);
    return ((0, jsx_runtime_1.jsx)(StyledCollapsibleContent, __assign({}, props, { forceMount: rendered ? props.forceMount : true, hasBeenOpen: hasBeenOpen, prerender: !rendered, ref: handleRef })));
}
exports.DynamicHeightCollapsibleContent = DynamicHeightCollapsibleContent;
