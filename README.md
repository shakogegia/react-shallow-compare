# Shallow Compare

Shallow Compare props for react that works for with `immutable.js` too
you can use it with recompose

install
```
npm i shallowcompare
```
or 
```
yarn add shallowcompare
```

### Usage

import

```js
import { shouldUpdate } from recompose
import { shallowCompare, shallowCompareOnly, shallowCompareExclude } from shallowcompare
```

you can choose 3 methods

compare whole props

```jsx
  shouldUpdate(shallowCompare),
```

or white list props

```jsx
  shouldUpdate(shallowCompareOnly(['prop1', 'prop2'])),
```

or black list props

```jsx
  shouldUpdate(shallowCompareExclude(['prop1', 'prop2'])),
```

you can also you it without `recompose`

```jsx

import { shallowCompare } from shallowcompare


class MyComponent extends React.Component {
  ...
  
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this.props, nextProps)
  }
  ...
}

```
