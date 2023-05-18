/* ************************************ */
/* Define helper functions */
/* ************************************ */
function assessPerformance() {
  /* Function to calculate the "credit_var", which is a boolean used to
  credit individual experiments in expfactory.
   */
  var experiment_data = jsPsych.data.getTrialsOfType('single-stim-button');
  var missed_count = 0;
  var trial_count = 0;
  var rt_array = [];
  var rt = 0;
    var avg_rt = -1;
  //record choices participants made
  for (var i = 0; i < experiment_data.length; i++) {
    trial_count += 1
    rt = experiment_data[i].rt
    if (rt == -1) {
      missed_count += 1
    } else {
      rt_array.push(rt)
    }
  }
  //calculate average rt
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array)
  } else {
    avg_rt = -1
  }
  credit_var = (avg_rt > 100)
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getStim = function() {
  var ref_board = makeBoard('your_board', curr_placement, 'ref')
  var target_board = makeBoard('peg_board', problems[problem_i])
  var canvas = '<div class = tol_canvas><div class="tol_vertical_line"></div></div>'
  var hold_box;
  if (held_ball !== 0) {
    ball = colors[held_ball - 1]
    hold_box = '<div class = tol_hand_box><div class = "tol_hand_ball tol_' + ball +
      '"><div class = tol_ball_label>' + ball[0] +
      '</div></div></div><div class = tol_hand_label><strong>Ball in Hand / Pelota en Mano</strong></div>'
  } else {
    hold_box =
      '<div class = tol_hand_box></div><div class = tol_hand_label><strong>Ball in Hand / Pelota en Mano</strong></div>'
  }
  return canvas + ref_board + target_board + hold_box
}

var getPractice = function() {
  var ref_board = makeBoard('your_board', curr_placement, 'ref')
  var target_board = makeBoard('peg_board', example_problem3)
  var canvas = '<div class = tol_canvas><div class="tol_vertical_line"></div></div>'
  var hold_box;
  if (held_ball !== 0) {
    ball = colors[held_ball - 1]
    hold_box = '<div class = tol_hand_box><div class = "tol_hand_ball tol_' + ball +
      '"><div class = tol_ball_label>' + ball[0] +
      '</div></div></div><div class = tol_hand_label><strong>Ball in Hand / Pelota en Mano</strong></div>'
  } else {
    hold_box =
      '<div class = tol_hand_box></div><div class = tol_hand_label><strong>Ball in Hand / Pelota en Mano</strong></div>'
  }
  return canvas + ref_board + target_board + hold_box
}

var getFB = function() {
  var data = jsPsych.data.getLastTrialData()
  var target = data.target
  var isequal = true
  correct = false
  for (var i = 0; i < target.length; i++) {
    isequal = arraysEqual(target[i], data.current_position[i])
    if (isequal === false) {
      break;
    }
  }
  var feedback;
  if (isequal === true) {
    feedback = "You got it! Muy bien!"
    correct = true
  } else {
    feedback = "Didn't get that one. Ese no lo conseguiste."
  }
  
  var ref_board = makeBoard('your_board', curr_placement)
  var target_board = makeBoard('peg_board', target)
  var canvas = '<div class = tol_canvas><div class="tol_vertical_line"></div></div>'
  var feedback_box = '<div class = tol_feedbackbox><p class = tol-feedback-text>' + feedback +
    '</p></div>'
  return canvas + ref_board + target_board + feedback_box
}


var getTime = function() {
  if ((time_per_trial - time_elapsed) > 0) {
    return time_per_trial - time_elapsed
  } else {
    return 1
  }
  
}

var getText = function() {
  return '<div class = centerbox><p class = center-block-text>Ready to play round ' + (problem_i + 2) + "?" +
    ' Press <strong>enter</strong> to begin.</p>' +
    '<p class = center-block-text>¿Listo para jugar problema ' + (problem_i + 2) + "?" +
    ' Oprime <strong>enter</strong> para empezar</p> </div>'
}

var pegClick = function(peg_id) {
  var choice = Number(peg_id.slice(-1)) - 1
  var peg = curr_placement[choice]
  var ball_location = 0
  if (held_ball === 0) {
    for (var i = peg.length - 1; i >= 0; i--) {
      if (peg[i] !== 0) {
        held_ball = peg[i]
        peg[i] = 0
        num_moves += 1
        break;
      }
    }
  } else {
    var open_spot = peg.indexOf(0)
    if (open_spot != -1) {
      peg[open_spot] = held_ball
      held_ball = 0
    }
  }
}

var makeBoard = function(container, ball_placement, board_type) {
  var board = '<div class = tol_' + container + '><div class = tol_base></div>'
  if (container == 'your_board') {
    board += '<div class = tol_board_label><strong>Your Board</strong></div>'
  } else {
    board += '<div class = tol_board_label><strong>Target Board</strong></div>'
  }
  for (var p = 0; p < 3; p++) {
    board += '<div id = tol_peg_' + (p + 1) + '><div class = tol_peg></div></div>' //place peg
      //place balls
    if (board_type == 'ref') {
      if (ball_placement[p][0] === 0 & held_ball === 0) {
        board += '<div id = tol_peg_' + (p + 1) + ' onclick = "pegClick(this.id)">'
      } else if (ball_placement[p].slice(-1)[0] !== 0 & held_ball !== 0) {
        board += '<div id = tol_peg_' + (p + 1) + ' onclick = "pegClick(this.id)">'
      } else {
        board += '<div class = special id = tol_peg_' + (p + 1) + ' onclick = "pegClick(this.id)">'
      }
    } else {
      board += '<div id = tol_peg_' + (p + 1) + ' >'
    }
    var peg = ball_placement[p]
    for (var b = 0; b < peg.length; b++) {
      if (peg[b] !== 0) {
        ball = colors[peg[b] - 1]
        board += '<div class = "tol_ball tol_' + ball + '"><div class = tol_ball_label>' + ball[0] +
          '</div></div>'
      }
    }
    board += '</div>'
  }
  board += '</div>'
  return board
}

var arraysEqual = function(arr1, arr2) {
  if (arr1.length !== arr2.length)
    return false;
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i])
      return false;
  }
  return true;
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var correct = false
//var user_id = "TESTMAR302022"
var user_id = getQueryVariable('id')

var getLink = function (id) {
  if (id.slice(-1) > 5) {
    return "https://stem-lab.vercel.app/?id=" + user_id
  } else {
    return "https://stem-lab.vercel.app/?id=" + user_id
  }
}
var exp_stage = 'practice'
var colors = ['Green', 'Red', 'Blue']
var problem_i = 0
var time_per_trial = 20000 //time per trial in seconds
var time_elapsed = 0 //tracks time for a problem
var date_n_time = new Date();
var num_moves = 0 //tracks number of moves for a problem
  /*keeps track of peg board (where balls are). Lowest ball is the first value for each peg.
  So the initial_placement has the 1st ball and 2nd ball on the first peg and the third ball on the 2nd peg.
  */
  // make Your board
var curr_placement = [
  [1, 2, 0],
  [3, 0],
  [0]
]
var example_problem1 = [
  [1, 2, 0],
  [0, 0],
  [3]
]
var example_problem2 = [
  [1, 0, 0],
  [3, 0],
  [2]
]
var example_problem3 = [
  [1, 0, 0],
  [3, 2],
  [0]
]
var ref_board = makeBoard('your_board', curr_placement)
var problems = [
  [
    [0, 0, 0],
    [3, 1],
    [2]
  ],
  [
    [1, 0, 0],
    [2, 0],
    [3]
  ],
  [
    [1, 3, 0],
    [2, 0],
    [0]
  ],
  [
    [1, 0, 0],
    [2, 3],
    [0]
  ],
  [
    [2, 1, 0],
    [3, 0],
    [0]
  ],
  [
    [3, 0, 0],
    [2, 1],
    [0]
  ],
  [
    [2, 3, 0],
    [0, 0],
    [1]
  ],
  [
    [0, 0, 0],
    [2, 3],
    [1]
  ],
  [
    [2, 1, 3],
    [0, 0],
    [0]
  ],
  [
    [2, 3, 1],
    [0, 0],
    [0]
  ],
  [
    [3, 1, 0],
    [2, 0],
    [0]
  ],
  [
   [3, 0, 0],
   [2, 0],
   [1]
  ]
     
]
var answers = [2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
var held_ball = 0

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
      }
  }
  console.log('Query variable %s not found', variable);
}
//Taken from https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript?

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
//Set up post task questionnaire

var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">' + user_id + '</p>'],
   rows: [15, 15],
    columns: [60, 60]
};

/* define static blocks */
var end_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "end",
        exp_id: 'tower_of_london'
    },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this game! Press the \"Enter\" key to continue!</p>' +
  '<p class = center-block-text>¡Gracias por completar el juego! ¡Oprima "Enter" para continuar! </div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
    'Ready to play <i>Tower of London</i>, ' + user_id + '? Press "Enter" on your keyboard to begin! <audio controls> <source src="audio/tol/entol1.wav" type="audio/ogg"></audio> <br><br>¿Listo para jugar <i>Torre de Londres</i>, ' + user_id + '? ¡Oprima "Enter" en suteclado para empezar! <audio controls><source src="audio/tol/estol1.wav"<audio></p>'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "instruction"
  },
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.

var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: [
    ref_board + makeBoard('peg_board', example_problem1) +
    '<div class = tol_bottombox><p class = block-text>In this game, we will show you two boards with colored balls that look like the above boards. </p><p class = block-text>Imagine that these balls have holes through them and the pegs fit through the holes. The first peg can hold three balls, the second peg can hold two balls, and the third peg can hold one ball. <audio controls> <source src="audio/tol/entol2.wav" type="audio/ogg"></audio></p><br><br>' + 
    '<p class = block-text>En este juego, vamos enseñarle dos tableros con pelotas de colores que se ven a los tableros anteriores.</p><p class = block-text>Imagínase que estas pelotas tienen ollos y que se pueden meter en los palitos en el tablero. En el primer palito caben tres pelotas, en el segundo caben dos pelotas, y en el tercer palito cabe una pelota. <audio controls> <source src="audio/tol/estol2.wav" type="audio/ogg"></audio> </p></div>',

    //<p class = block-text>En este juego, vamos enseñarle dos tableros con pelotas de colores que se ven asi: </p>
    ref_board + makeBoard('peg_board', example_problem1) +
    '<div class = tol_bottombox><p class = block-text>You have to move the balls on your board to make your board look like target board, in the <b>fewest possible moves.</b></p>' +
    '<p class = block-text>Sometimes you will have to move a ball to a different peg in order to get to the ball below it. <br> You will have <strong>20 seconds</strong> to play each round.<audio controls> <source src="audio/tol/entol3.wav" type="audio/ogg"></audio><br><br></p><br><br>' +
    '<p class = block-text>Tiene que mover las pelotas en la tabla para que su tabla se mire como el "Target Board", moviendo las pelotas lo menos possible.</b></p>' +
    '<p class = block-text>A veces va tener que mover una pelota a otro palito para llegar a la pelota debajo. <br> Tiene <strong>20 segundos</strong> para completar esta sección.<audio controls> <source src="audio/tol/entol3.wav" type="audio/ogg"></audio><br><br></p></div>',

    ref_board + makeBoard('peg_board', example_problem2) +
    '<div class = tol_bottombox><p class = block-text>Here is an example. On your board, if we move the red ball from the first peg the third peg then it would look like the target board.</p><audio controls> <source src="audio/tol/entol4.wav" type="audio/ogg"></audio>' +
    '<p class = block-text>Aquí hay un ejemplo. Si movemos la pelota roja del primer palito al tercer palito en su tabla, severá como el target board.</p><audio controls> <source src="audio/tol/estol4.wav" type="audio/ogg"></audio></div>' ,

    "<div class = centerbox><p class = block-text>You will move the balls on your board by clicking on the pegs. When you click on a peg, the top ball will move into a box called 'your hand'. When you click on another peg, the ball in 'your hand' will move to the top of that peg.</p><p class = block-text>If you try to select a peg with no balls or try to place a ball on a full peg, nothing will happen. If you make your board look like the target board, you will move to the next problem.</p><p class = block-text>We will start with an easy example so that you can practice. <audio controls> <source src='audio/tol/entol5.wav' type='audio/ogg'></audio></p>" +
    "<p class = block-text>Para mover una pelota, hágale clic en el palito dónde está la pelota que quieres mover. Cuando le haga clic a un palito, la pelota por encima se moverá al cuadro que dice `Pelota en mano.` Cuando le haga clic en otro palito, la pelota en mano se moverá a la parte superior del palito. </p><p class = block-text>Si elije un palito sin pelotas o intentas poner una pelota en un palito que ya está llena, nada sucederá. Cuando haya completado su tabla para que se vea como el `target board,` pasará al siguiente problema. </p><p class = block-text>Empezaremos con un ejemplo fácil para poder practicar<audio controls> <source src='audio/tol/estol5.wav' type='audio/ogg'></audio></p></div>",
    "<div class = centerbox align=center ><p style='font-size: 24px'>Here is a video example:</p><p style='font-size: 24px'>Este es un ejemplo video: <video width='640' height='480' controls><source src='demos/toldemo.mov' type='video/mp4'></video>"
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],
  /* This function defines stopping criteria */
  loop_function: function(data) {
    for (i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
        rt = data[i].rt
        sumInstructTime = sumInstructTime + rt
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}


var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "instruction"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>Ready to play? There will be ' +
    problems.length + ' rounds to complete. Press <strong>enter</strong> to begin.</p>' +
   '<p class = block-text>¿Listo para jugar? Hay ' + problems.length + ' que completar. Oprime "enter" para empezar</p> </div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function() {
    exp_stage = 'test'
    held_ball = 0
    time_elapsed = 0
    num_moves = 0;
    curr_placement = [
      [1, 2, 0],
      [3, 0],
      [0]
    ]
  }
};

var advance_problem_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "advance",
    exp_stage: 'test'
  },
  timing_response: 180000,
  text: getText,
  cont_key: [13],
  on_finish: function() {
    held_ball = 0
      time_elapsed = 0
      date_n_time = new Date();
    problem_i += 1;
    num_moves = 0;
    curr_placement = [
      [1, 2, 0],
      [3, 0],
      [0]
    ]
  }
}

var practice_tohand = {
  type: 'single-stim-button',
  stimulus: getPractice,
  button_class: 'special',
  is_html: true,
  data: {
    trial_id: "to_hand",
    exp_stage: 'practice'
  },
  timing_stim: getTime,
  timing_response: getTime,
  timing_post_trial: 0,
  on_finish: function(data) {
    if (data.mouse_click != -1) {
      time_elapsed += data.rt
    } else {
      time_elapsed += getTime()
    }
      date_n_time = new Date();
    jsPsych.data.addDataToLastTrial({
      'current_position': jQuery.extend(true, [], curr_placement),
      'num_moves_made': num_moves,
      'target': example_problem3,
      'min_moves': 1,
      'problem_id': 'practice'
    })
  }
}

var practice_toboard = {
  type: 'single-stim-button',
  stimulus: getPractice,
  button_class: 'special',
  is_html: true,
  data: {
    trial_id: "to_board",
    exp_stage: 'practice'
  },
  timing_stim: getTime,
  timing_response: getTime,
  timing_post_trial: 0,
  on_finish: function(data) {
    if (data.mouse_click != -1) {
      time_elapsed += data.rt
    } else {
      time_elapsed += getTime()
    }
      date_n_time = new Date();
    jsPsych.data.addDataToLastTrial({
      'current_position': jQuery.extend(true, [], curr_placement),
      'num_moves_made': num_moves,
      'target': example_problem3,
      'min_moves': 1,
      'problem_id': 'practice'
    })
  }
}

var test_tohand = {
  type: 'single-stim-button',
  stimulus: getStim,
  button_class: 'special',
  is_html: true,
  data: {
    trial_id: "to_hand",
    exp_stage: 'test'
  },
  timing_stim: getTime,
  timing_response: getTime,
  timing_post_trial: 0,
  on_finish: function(data) {
    if (data.mouse_click != -1) {
      time_elapsed += data.rt
    } else {
      time_elapsed += getTime()
    }
      date_n_time = new Date();
    jsPsych.data.addDataToLastTrial({
      'current_position': jQuery.extend(true, [], curr_placement),
      'num_moves_made': num_moves,
      'target': problems[problem_i],
      'min_moves': answers[problem_i],
      'problem_id': problem_i
    })
  }
}

var test_toboard = {
  type: 'single-stim-button',
  stimulus: getStim,
  button_class: 'special',
  is_html: true,
  data: {
    trial_id: "to_board",
    exp_stage: 'test'
  },
  timing_stim: getTime,
  timing_response: getTime,
  timing_post_trial: 0,
  on_finish: function(data) {
    if (data.mouse_click != -1) {
      time_elapsed += data.rt
    } else {
      time_elapsed += getTime()
    }
      date_n_time = new Date();
    jsPsych.data.addDataToLastTrial({
      'current_position': jQuery.extend(true, [], curr_placement),
      'num_moves_made': num_moves,
      'target': problems[problem_i],
      'min_moves': answers[problem_i],
      'problem_id': problem_i
    })
  }
}

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFB,
  choices: 'none',
  is_html: true,
  data: {
    trial_id: 'feedback'
  },
  timing_stim: 2000,
  timing_response: 2000,
  timing_post_trial: 500,
  on_finish: function() {
      jsPsych.data.addDataToLastTrial({
          'exp_stage': exp_stage,
          'problem_time': time_elapsed,
          'correct': correct,
      'date_n_time': new Date()
    })
  },
}

var practice_node = {
  timeline: [practice_tohand, practice_toboard],
  loop_function: function(data) {
    if (time_elapsed >= time_per_trial) {
      return false
    }
      data = data[1]
      date_n_time = new Date();
    var target = data.target
    var isequal = true
    for (var i = 0; i < target.length; i++) {
      isequal = arraysEqual(target[i], data.current_position[i])
      if (isequal === false) {
        break;
      }
    }
    return !isequal
  },
  timing_post_trial: 1000
}

var problem_node = {
  timeline: [test_tohand, test_toboard],
  loop_function: function(data) {
    if (time_elapsed >= time_per_trial) {
      return false
    }
      data = data[1]
      date_n_time = new Date();
    var target = data.target
    var isequal = true
    for (var i = 0; i < target.length; i++) {
      isequal = arraysEqual(target[i], data.current_position[i])
      if (isequal === false) {
        break;
      }
    }
    return !isequal
  },
  timing_post_trial: 1000
}

/* create experiment definition array */
var tower_of_london_experiment = [];
tower_of_london_experiment.push(instruction_node);
tower_of_london_experiment.push(practice_node);
tower_of_london_experiment.push(feedback_block);
tower_of_london_experiment.push(start_test_block);
for (var i = 0; i < problems.length; i++) {
  tower_of_london_experiment.push(problem_node);
  tower_of_london_experiment.push(feedback_block)
  if (i != problems.length-1) {
    tower_of_london_experiment.push(advance_problem_block)
  }
}

tower_of_london_experiment.push(end_block);
var final_block = {
    type: 'poldrack-text',
    data: {
        trial_id: "end",
        exp_id: 'tower_of_london'
    },
    timing_response: 180000,
    text: '<div class = centerbox><p id="gameIDtext" class = center-block-text>Thank you for playing. <a href="' + getLink(user_id) + '">Please click here to continue.</a></p></div>',
    timing_post_trial: 0,
};
tower_of_london_experiment.push(final_block);


