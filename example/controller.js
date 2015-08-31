
angular.module('Example').controller('ExampleCtrl', exampleController);
exampleController.$inject = ['$scope'];

function exampleController($scope) {


	this.choices = [
		{
			'name': 'Coca-Cola',
			'value': 'coke'
		},
		{
			'name': 'Pepsi Cola',
			'value': 'pepsi'
		},
		{
			'name': 'Mountain Dew',
			'value': 'mountain-dew'
		},
		{
			'name': 'API-IPA',
			'value': 'api-ipa'
		}
	];

	this.selectedChoice = this.choices[0];

	this.selectChoice = function(choice) {
		this.selectedChoice = choice;
	};

	this.getSelectedChoice = function() {
		return "Selected: " + this.selectedChoice.name;
	};

	this.dismissExternalDropdown = function() {
		$scope.$broadcast('angular-customizable-dropdown/externalDropdown/close');
	};
}
