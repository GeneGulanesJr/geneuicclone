iisApp.controller('login', function ($scope, $http) {


	////////////////////////////////////////////////
	// @author: Teddy C. 03/02/18.
	// 
	//
	//
	////////////////////////////////////////////////

	////////////////////////////////////////////////
	// Declaration and Initialization
	////////////////////////////////////////////////
	$scope.login_attempts = $('#loginAttempts').val();
	$scope.login_penalty = $('#loginPenalty').val();
	$scope.login_current_datetime = $('#currentDateTime').val();
	////////////////////////////////////////////////
	// End of Declaration and Initialization
	////////////////////////////////////////////////

	////////////////////////////////////////////////
	// Declaration of Functions
	////////////////////////////////////////////////
	/**
	 * Method: runTimer
	 * Description: Run and show penalty timer.
	 * @author: Teddy C.
	 * @date: 03/27/2019 16:16.
	 */
	$scope.runTimer = function(time, format){
		let timerInterval
		Swal.fire({
			title: 'Reached the maximum attempt',
			html: 'You can login in <strong><span id="swal-minutes"></span></strong> minutes <strong><span id="swal-seconds"></span></strong> seconds.',
			type: 'info',
			timer: time,
  			allowOutsideClick: () => false,
			onOpen: () => {
				Swal.showLoading()
				timerInterval = setInterval(() => {
				    const content = Swal.getContent()
				    const $ = content.querySelector.bind(content)
				    Swal.getContent().querySelector('#swal-minutes').textContent = Math.floor(Swal.getTimerLeft() / 60000)
				    Swal.getContent().querySelector('#swal-seconds').textContent = ((Swal.getTimerLeft() % 60000) / 1000).toFixed(0)
				}, 500)
			},
			onClose: () => {
				clearInterval(timerInterval)
			}
		}).then((result) => {
			if (result.dismiss === Swal.DismissReason.timer) {
				$scope.login_attempts = 0;
				$scope.login_penalty = "";
				$scope.login_current_datetime = "";
			}
		});
	};
	// End of runTimer.

	/**
	 * Method: checkPenalty
	 * Description: Check if attempt exceeds, then run and show timer.
	 * @author: Teddy C.
	 * @date: 03/27/2019 16:16.
	 */
	$scope.checkPenalty = function(penalty,current,format){
		if (Date.parse(penalty)) {
			penalty = new Date(penalty);
			current = new Date(current);

			if(current < penalty){
				$scope.runTimer((penalty.getTime()-current.getTime()),format);
			}
			else{
				$scope.login_attempts = 0;
			}
		} 
	};
	// End of checkPenalty.

	/**
	 * Method: Login
	 * Description: Check if attempt exceeds, then run and show timer.
	 * @author: Teddy C.
	 * @update: 03/27/2019 16:20.
	 */
	$scope.Login = function(record){
		if($scope.login_attempts < 5){
			var dsp_attempts = $scope.login_attempts;
			swal.queue([{
				title: 'Authenticating...',
				text: (++dsp_attempts) + '/5 login attempt(s)',
				confirmButtonText: 'Confirm',
				showLoaderOnConfirm: true,
				onOpen: function(){
					Swal.clickConfirm()
				},
	  			allowOutsideClick: () => !swal.isLoading(),
				preConfirm: () => {
					return $http({
								method: 'GET',
								url: url + '?fa=login.login_process',
								params: { 
								    'username': record.username,
								    'password': record.password
								}
							})
							.then(function(response) {
								if(response.data.result_id > 0) {
									window.location.href = url + '?fa=home.index';
								}
								else {
									$scope.login_attempts = response.data.attempts;
									$scope.login_penalty = response.data.penalty;
									$scope.login_current_datetime = response.data.current;

									swal.insertQueueStep({
										type: 'error',
										title: 'Incorrect username or password!',
										confirmButtonText: 'Try Again',
										onClose: () => {
											if(Date.parse($scope.login_penalty)){
												$scope.checkPenalty($scope.login_penalty, $scope.login_current_datetime, 'queue');
											}
										}
									});
								}
							})
							.catch(function(response) {
								swal.insertQueueStep({
									type: 'error',
									title: 'Login: FAILED! Something went wrong please try again or contact MIS Developers!'
								})
								console.log(response);
							})
							.finally(function(){
								$('.offline-toast').remove();
							});
				}
			}]);
		}
		else{
			$scope.checkPenalty($scope.login_penalty,$scope.login_current_datetime,'');
		}

		// var content = 'Please wait... ' + "&nbsp&nbsp" + '<div class="preloader-wrapper small active">' +
		//     '<div class="spinner-layer spinner-green-only">' + '<div class="circle-clipper left">' +
		//         '<div class="circle"></div>' + '</div><div class="gap-patch">' +
		//         '<div class="circle"></div>' + '</div><div class="circle-clipper right">' +
		//         '<div class="circle"></div>' +
		//       '</div>' + '</div>' + '</div>';

		// Materialize.toast(content, 100000, 'offline-toast');

		// $http({
		// 	method: 'GET',
		// 	url: url + '?fa=login.login_process',
		// 	params: { 
		// 	    'username': record.username,
		// 	    'password': record.password
		// 	}
		// })
		// .then(function(response) {
		// 	if(response.data > 0) {
		// 		window.location.href = url + '?fa=home.index';
		// 	}
		// 	else {
		// 		Materialize.toast('Incorrect username or password!', 2000, 'red');
		// 		console.log(response);
		// 	}
		// })
		// .catch(function(response) {
		// 	Materialize.toast('Login: FAILED! Something went wrong please try again or contact MIS Developers!', 2000, 'red');
		// 	console.log(response);
		// })
		// .finally(function(){
		// 	$('.offline-toast').remove();
		// });
	};
	// End of Login.
	////////////////////////////////////////////////
	// End of Declaration of Functions
	////////////////////////////////////////////////

	////////////////////////////////////////////////
	// Call Functions
	////////////////////////////////////////////////
	$scope.checkPenalty($scope.login_penalty,$scope.login_current_datetime,'');
	////////////////////////////////////////////////
	// End of Call Functions
	////////////////////////////////////////////////

	////////////////////////////////////////////////
	// JS Functions
	////////////////////////////////////////////////
	/**
	 * Method: window.history
	 * Description: Prevent page to go previous page.	
	 * @author: Teddy C.
	 */
	window.history.pushState(null, "", window.location.href);        
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
    };
	// End of window.history.
	////////////////////////////////////////////////
	// End of JS Functions
	////////////////////////////////////////////////
});