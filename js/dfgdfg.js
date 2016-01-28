(function (e) {
	e.fn.equalHeight = function (t) {
		var t = e.extend({amount: 2, useParent: false, parent: null, resize: false}, t);
		var n = e(this);
		n.removeAttr("style");
		if (t.useParent == true) {
			if (t.parent == null) {
				var r = e(this).parent().outerWidth()
			} else {
				var r = t.parent.outerWidth()
			}
			var i = e(this).outerWidth(true);
			t.amount = parseInt(r / i);
			newAmount = t.amount
		}
		var s = this;
		if (t.resize == true && t.useParent == true) {
			e(window).resize(function () {
				n.removeAttr("style");
				if (t.useParent == true) {
					if (t.parent == null) {
						var r = s.parent().outerWidth()
					} else {
						var r = t.parent.outerWidth()
					}
					var i = s.outerWidth(true);
					t.amount = parseInt(r / i)
				}
				return s.each(function (r) {
					if (r % t.amount === 0) {
						var i = r + 1;
						var s = e(this);
						var o = s.index();
						var u = [];
						var a = [s];
						for (var f = 1; f < t.amount; f++) {
							var l = e(n[r + f]);
							a.push(l)
						}
						for (var c = 0; c < t.amount; c++) {
							u.push(a[c].outerHeight())
						}
						var h = Math.max.apply(Math, u);
						e(a).each(function (t) {
							var n = e(this);
							n.css("height", h)
						})
					}
				})
			})
		}
		return this.each(function (r) {
			if (r % t.amount === 0) {
				var i = r + 1;
				var s = e(this);
				var o = s.index();
				var u = [];
				var a = [s];
				for (var f = 1; f < t.amount; f++) {
					var l = e(n[r + f]);
					a.push(l)
				}
				for (var c = 0; c < t.amount; c++) {
					u.push(a[c].outerHeight())
				}
				var h = Math.max.apply(Math, u);
				e(a).each(function (t) {
					var n = e(this);
					n.css("height", h)
				})
			}
		})
	}
})