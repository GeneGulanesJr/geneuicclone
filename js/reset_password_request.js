iisApp.controller('reset_password_request', function ($scope, $http, $timeout) {


	////////////////////////////////////////////////
	// @author: Teddy C. 03/02/18.
	// 
	//
	//
	////////////////////////////////////////////////

	////////////////////////////////////////////////
	// Declaration and Initialization
	////////////////////////////////////////////////
	$scope.user_type = 0;
	$scope.step = 1;
	$scope.encrypted_email = "";
	$scope.account = [];
	$scope.prev = "";
	var timer = null;
	var captcha_code;
	////////////////////////////////////////////////
	// End of Declaration and Initialization
	////////////////////////////////////////////////

	////////////////////////////////////////////////
	// Declaration of Functions
	////////////////////////////////////////////////
	/**
	 * Method: RunTimer
	 * Description: run timer to prevent click spam on resend button.
	 * @author: Teddy C.
	 * @date: 08/09/2019 14:21.
	 */	
	$scope.RunTimer = function(){
		var time = 10;
		 $('#btn_resend_email').attr('disabled','disabled');

		timer = setInterval(function(){
			if(time <= 0){
			 	$('#btn_resend_email').html('Resend Email');
        	 	$('#btn_resend_email').removeAttr('disabled');
				clearInterval(timer);
				timer = null;
			}
			else{
				$('#btn_resend_email').html('Resend Email [' + time + ']');
				time--;
			}
		}, 1000);
	};
	// End of RunTimer.

	/**
	 * Method: ValidateEmail
	 * Description: Check if email is valid.
	 * @author: Teddy C.
	 * @date: 08/08/2019 09:17.
	 */
	$scope.ValidateEmail = function(email){
		console.log(email)
	  	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  	return regex.test(email);
	}
	// End of ValidateEmail.

	/**
	 * Method: ValidateCaptcha
	 * Description: Check if captcha is correct.
	 * @author: Teddy C.
	 * @date: 08/08/2019 09:17.
	 */
	$scope.ValidateCaptcha = function(k) {
		return (k === captcha_code);
	}
	// End of ValidateCaptcha.

	/**
	 * Method: GenerateCaptcha
	 * Description: Generate new captcha.
	 * @author: Teddy C.
	 * @date: 08/08/2019 09:17.
	 */
	$scope.GenerateCaptcha = function(id){
		document.getElementById(id).innerHTML = ""; //clear the contents of captcha div first 
		var charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var lengthOtp = 6;
		var captcha = [];

		for (var i = 0; i < lengthOtp; i++) {
		    //below code will not allow Repetition of Characters
		    var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
		    if (captcha.indexOf(charsArray[index]) == -1)
		    	captcha.push(charsArray[index]);
		    else i--;
		}

		var canv = document.createElement("canvas");
		canv.id = id;
		canv.width = 130;
		canv.height = 35;

		var ctx = canv.getContext("2d");
		ctx.font = "25px Georgia";
		ctx.strokeText(captcha.join(""), (canv.width/2) - (ctx.measureText(captcha.join("")).width / 2), 30);

		//storing captcha so that can validate you can save it somewhere else according to your specific requirements
		captcha_code = captcha.join("");
		document.getElementById(id).appendChild(canv); // adds the canvas to the body element

		$scope.prev = id;
	};
	// End of GenerateCaptcha.

	/**
	 * Method: Step
	 * Description: Navigate steps.
	 * @author: Teddy C.
	 * @date: 08/08/2019 09:17.
	 */
	$scope.Step = function(s,t){
		$scope.step = s;
		$scope.user_type = t;

		if(s == 2 && t == 1) $scope.GenerateCaptcha('captcha-student');
		if(s == 2 && t == 2) $scope.GenerateCaptcha('captcha');
	};
	// End of Step.

	/**
	 * Method: ResendEmail
	 * Description: Resend reset password request email verification.
	 * @author: Teddy C.
	 * @date: 08/08/2019 09:17.
	 */
	$scope.ResendEmail = function (){
		swal.queue([{
			title: 'Resend Email Confirmation',
			text: 'Loading, please wait...',
			confirmButtonText: 'Continue',
			showLoaderOnConfirm: true,
			onOpen: function(){
				Swal.clickConfirm()
			},
			allowOutsideClick: () => !swal.isLoading(),
			preConfirm: () => {
				return $http({
					method: 'POST',
					url: url + '?fa=login.reset_password_resend',
					params: { 'key': $scope.account.key }
				})
				.then(function(response) {
					if(response.data.error != ""){
						console.log(response);
						swal.insertQueueStep({
							type: 'error',
							title: 'Resend Email Confirmation Failed',
							text: response.data.error
						})
					}
					else{
						if(response.data.result == 1){
							$scope.run_timer();
							swal.insertQueueStep({
								type: 'success',
								title: 'Resend Email Confirmation',
								text: 'Email sent.'
							})
						}
					}
				})
				.catch(function(response) {
					console.log(response);
					swal.insertQueueStep({
						type: 'error',
						title: 'Resend Email Confirmation Failed',
						text: 'Oops! Something went wrong please try again.'
					})
				});
			}
		}]);
	}
	// End of ResendEmail.

	/**
	 * Method: SendResetPasswordRequest
	 * Description: Create request for reset password.
	 * @author: Teddy C.
	 * @date: 08/08/2019 09:17.
	 */
	$scope.SendResetPasswordRequest = function(info){
		if($scope.ValidateCaptcha(info.captcha)){
			swal.queue([{
				title: 'Reset Password Request',
				text: 'Loading, please wait...',
				confirmButtonText: 'Continue',
				showLoaderOnConfirm: true,
				onOpen: function(){
					Swal.clickConfirm()
				},
				allowOutsideClick: () => !swal.isLoading(),
				preConfirm: () => {
					return $http({
						method: 'POST',
						url: url + '?fa=account.json_get_account_key_by_username',
						params: { 'u_id': info.username, 'd_id': info.dob, ut_id: $scope.user_type }
					})
					.then(function(response) {
						if(response.data.error != ""){
							console.log(response);
							swal.insertQueueStep({
								type: 'error',
								title: 'Account Verification Failed',
								text: response.data.error
							})
						}
						else{
							$scope.account = response.data.result;
							$scope.Step(3,0);
						}
					})
					.catch(function(response) {
						console.log(response);
						swal.insertQueueStep({
							type: 'error',
							title: 'Account Verification Failed',
							text: 'Oops! Something went wrong please try again.'
						})
					})
					.finally(function(){
						if($scope.user_type == 1) $scope.GenerateCaptcha('captcha-student');
						if($scope.user_type == 2) $scope.GenerateCaptcha('captcha');
						$scope.account.captcha = "";
					});
				}
			}]);
		}
		else{
			swal.fire({
				type: 'error',
				title: 'Incorrect Captcha',
				text: "You've entered an incorrect captcha. Please try again."
			})
			$scope.account.captcha = "";
			if($scope.user_type == 1) $scope.GenerateCaptcha('captcha-student');
			if($scope.user_type == 2) $scope.GenerateCaptcha('captcha');
		}
	};
	// End of SendResetPasswordRequest.
	////////////////////////////////////////////////
	// End of Declaration of Functions
	//////////////////////////////////////////////// 

	////////////////////////////////////////////////
	// Call Functions
	////////////////////////////////////////////////
	////////////////////////////////////////////////
	// End of Call Functions
	////////////////////////////////////////////////

	////////////////////////////////////////////////
	// JS Functions
	////////////////////////////////////////////////
	////////////////////////////////////////////////
	// End of JS Functions
	////////////////////////////////////////////////
});