# Angular Customizable Dropdown #

The Angular Customizable Dropdown is a somewhat simple yet flexible dropdown component. The aim of this component is to uncouple your data and its representation from basic functionality. 

+ No external dependencies (jQuery not required, Angular jQuery Lite compatible)
+ Flexible and customizable
+ No enforced styling
+ Simple to use

Also available as a bower package, __angular-customizable-dropdown__.

# Building #

Simple __npm install__ will suffice.

Run __grunt dist__ to build the minified version, which will be placed in the __dist__ directory.

# Usage #

Simply include the __ac-dropdown.min.js__ to your HTML and add the __AngularCustomizableDropdown__ module as a dependency to your Angular app, like:

```javascript
angular.module('Example', ['AngularCustomizableDropdown']);
```

Now you're ready to start using it. Just add it as an __ac-dropdown__ element or attribute, like:

```
<div ac-dropdown selected-text="example.selectedText">
    <ul class="dropdown-content">
        <li ng-repeat="choice in example.choices" ng-bind="choice.name" ng-click="example.selectChoice(choice)"></li>
    </ul>
</div>
```

See the examples page for more details.

# Examples #

Functional examples can be found here:

https://rawgit.com/Valvefi/angular-customizable-dropdown/master/example/index.html

# License #

Licensed under the MIT license.

