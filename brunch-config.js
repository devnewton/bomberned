module.exports = {
	files: {
		javascripts: {
			joinTo: {
				'app.js': /^app/,
				'js/vendor.js': /^(node_modules)/
			}
		},
		stylesheets: {
			joinTo: 'app.css'
		}
	},
	modules: {
		autoRequire: {
			'app.js': ['BombernedApp']
		}
	},
	notifications: false,
	plugins: {
		brunchTypescript: {
			ignoreErrors: true
		}
	}
}
