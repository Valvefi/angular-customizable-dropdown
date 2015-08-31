/**
 * Customizable dropdown for Angular.
 *
 * Default functionality:
 * - When clicked opens the dropdown content.
 * - When dropdown content is inside the directive element the content's visibility is handled automatically.
 * - When clicked while open the dropdown gets closed.
 * - When clicked outside the dropdown the dropdown gets closed.
 * - When opened the onOpened binding if set is eval'd.
 * - When closed the onClosed binding if set is eval'd.
 * - When openOnHover == true opens the dropdown content on mouse hover.
 * - When mouseLeaveTimeout is set to a number the mouseleave triggers dropdown content hiding in the given number of milliseconds.
 * - Listens to angular-customizable-dropdown/<name>/close event and closes the dropdown upon receiving it.
 * - selectedText attribute is eval'd and shown as the dropdown element selected text.
 * - When contentSelector is set the content is assumed to be elsewhere and defined by the selector.
 * - When contentSelector is set the opening the dropdown content
 *   is handled manually using the onOpened and onClosed attribute bindings.
 *
 *   Attributes:
 *   - onOpened                 If set this statement gets eval'd when the dropdown is opened.
 *                              Note: must be set when the contentSelector attribute is set.
 *                              Undefined by default.
 *
 *   - onClosed                 If set this statement gets eval'd when the dropdown is closed.
 *                              Note: must be set when the contentSelector attribute is set.
 *                              Undefined by default.
 *
 *   - selectedText             Text that is shown on the dropdown element.
 *
 *   - openOnHover              If set to true opens the dropdown content on mouse enter.
 *                              False by default.
 *
 *   - mouseLeaveTimeout        Time in milliseconds to wait until closing the dropdown content after mouse leaves the dropdown
 *                              and dropdown content.
 *                              0 by default.
 *
 *   - name                     The name of the dropdown for receiving events.
 *                              Undefined by default.
 *
 *   - closeOnContentClick      If set to true closes the dropdown content when it's clicked.
 *                              True by default.
 */

(function() {


	angular.module("AngularCustomizableDropdown", []).directive('acDropdown', angularCustomizedDropdown);
	angularCustomizedDropdown.$inject = ['$rootScope', '$timeout'];

	function angularCustomizedDropdown($rootScope, $timeout) {

		var directive = {
			restrict: 'EA',
			templateUrl: 'angular-customizable-dropdown-template.html',
			transclude: true,
			scope: {
				selectedText: '=',
				name: '@'
			},
			link: link,
			controller: controller
		};

		link.$inject = ['scope', 'element', 'attrs'];
		function link(scope, element, attrs) {

			element.addClass("customized-dropdown");

			scope.closeOnContentClick = true;
			if (typeof attrs.closeOnContentClick != 'undefined') {
				scope.closeOnContentClick = attrs.closeOnContentClick == 'true';
			}
			if (typeof attrs.openOnHover != 'undefined') {
				scope.openOnHover = attrs.openOnHover == 'true';
			}
			if (typeof attrs.contentSelector != 'undefined') {
				scope.contentSelector = attrs.contentSelector;
			}
			if (typeof attrs.onOpened != 'undefined') {
				scope.onOpened = attrs.onOpened;
			}
			if (typeof attrs.onClosed != 'undefined') {
				scope.onClosed = attrs.onClosed;
			}
			if (typeof attrs.mouseLeaveTimeout != 'undefined') {
				scope.mouseLeaveTimeout = parseInt(attrs.mouseLeaveTimeout, 10);
				if(isNaN(scope.mouseLeaveTimeout)) {
					scope.mouseLeaveTimeout = 0;
				}
			}
			else {
				scope.mouseLeaveTimeout = 0;
			}


			var contentSelector = scope.contentSelector;

			if (scope.openOnHover) {

				if (typeof contentSelector == 'string') {
					var contentElem = angular.element(document.querySelector(contentSelector));

					contentElem.on("mouseenter", function () {
						scope.$apply(function () {
							scope.hoveringOverContent = true;
							if (typeof scope.hoverTimeout != 'undefined') {
								scope.CancelHide();
							}
						});
					}).on("mouseleave", function() {
						scope.$apply(function () {
							scope.hoveringOverContent = false;
							scope.TriggerHide();
						});
					});

				}


				element.on("mouseenter", function () {
					scope.$apply(function () {
						scope.contentHidden = false;
						scope.hoveringOverElement = true;

						if (typeof scope.hoverTimeout != 'undefined') {
							scope.CancelHide();
						}
						scope.CallOpenCallback();
					});
				}).on("mouseleave", function () {
					scope.$apply(function () {
						scope.hoveringOverElement = false;
						scope.TriggerHide();
					});
				});
			}


			function isElementChildOfDropdownContent(elem) {
				var e = angular.element(elem);
				var parent = e.parent();
				while(parent.length > 0) {
					if(parent.attr('dropdown-content') != undefined) {
						return true;
					}
					parent = parent.parent();
				}
			}

			function isElementContentSelectorOrChildOfContentSelector(elem, selector) {
				var e = angular.element(elem);
				var parent = e.parent();
				while(parent.length > 0) {
					if(parent[0].querySelector(selector) != null) {
						return true;
					}
					parent = parent.parent();
				}
				return false;
			}

			function isElementChildOf(childCandidate, parentElement) {
				var c = angular.element(childCandidate);
				var parent = c.parent();
				while(parent.length > 0) {
					if(parent[0] == parentElement) {
						return true;
					}
					parent = parent.parent();
				}
				return false;
			}

			angular.element(document).on('click', function (e) {

				var isClickedElementMyChild = isElementChildOf(e.target, element[0]);
				var isClickedElementMe = element[0] == e.target;
				var isClickedElementContent = (isClickedElementMyChild && isElementChildOfDropdownContent(e.target)) ||
					(typeof(scope.contentSelector) == 'string' && isElementContentSelectorOrChildOfContentSelector(e.target, scope.contentSelector));
				var isClickedElementChildOrMe = isClickedElementMyChild || isClickedElementMe;

				// Conditions for closing the content.
				if (!scope.contentHidden && (
						// Clicked element that is my element and did not click inside dropdown content
					( isClickedElementChildOrMe && !isClickedElementContent ) ||
						// Close on content click is true
					( scope.closeOnContentClick &&
						// and either we clicked the dropdown content or the dropdown itself
					( isClickedElementContent || isClickedElementChildOrMe )
					) ||
						// or we clicked completely outside the content and the dropdown, and our content is a child
					( !isClickedElementChildOrMe && !isClickedElementContent)
					)) {
					scope.$apply(function () {
						scope.Hide();
					});
					return;
				}
				// Conditions for showing the content.
				else if (scope.contentHidden && isClickedElementChildOrMe) {
					scope.$apply(function () {
						scope.contentHidden = false;
						scope.CallOpenCallback();
					});
					return;
				}


				scope.$apply();


			});
		}

		controller.$inject = ['$scope'];
		function controller($scope) {
			$scope.contentHidden = true;
			$scope.hoverTimeout = undefined;
			$scope.hoveringOverElement = false;
			$scope.hoveringOverContent = false;

			$scope.TriggerHide = function () {

				if (!$scope.hoveringOverElement && !$scope.hoveringOverContent) {
					$scope.hoverTimeout = $timeout(function () {
						$scope.Hide();
					}, $scope.mouseLeaveTimeout);
				}

			};

			$scope.CallOpenCallback = function () {
				if (typeof $scope.onOpened != 'undefined') {
					$scope.$parent.$eval($scope.onOpened);
				}
			};

			$scope.CallCloseCallback = function () {
				if (typeof $scope.onClosed != 'undefined') {
					$scope.$parent.$eval($scope.onClosed);
				}
			};

			$scope.CancelHide = function () {
				$timeout.cancel($scope.hoverTimeout);
			};

			$scope.$on('angular-customizable-dropdown/' + $scope.name + '/close', function (event, args) {
				$scope.Hide();
			});

			$scope.Hide = function () {
				$scope.contentHidden = true;
				$scope.CallCloseCallback();
			};
		}

		return directive;
	}

})();