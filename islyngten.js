/**
 * islyngten - JavaScript library supplying I18N translation support for Node.js and the browser.
 *
 * @copyright: Copyright (c) 2013-present, tbillenstein
 *
 * @author: tbillenstein <tb@thomasbillenstein.com> (https://thomasbillenstein.com)
 *
 * @license This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


(function(window)
{
	if (typeof module === 'object' && module && typeof module.exports === 'object')
	{
		module.exports = Islyngten;
	}
	else
	{
		/* istanbul ignore next */
		window.Islyngten = Islyngten;
	}

	function Islyngten()
	{
		'use strict';

		const _resources = {};

		function ResourceBundle(context, locale, resources)
		{
			this.context = function()
			{
				return context;
			};

			this.locale = function()
			{
				return locale;
			};

			this._ = this.t = this.get = function(key, params)
			{
				return translate(key, 1, params);
			};

			this.__ = this.tt = this.nget = function(singular, plural, count, params)
			{
				return count === 1 ? translate(singular, 1, params) : translate(plural, count, params);
			};

			function translate(key, count, params)
			{
				var resource = getValue(key),
					p;

				if (count !== 1 && typeof resource === "object")
				{
					resource = evalMulti(key, resource, count);
				}

				if (resource && params)
				{
					for (p in params)
					{
						if (params.hasOwnProperty(p))
						{
							resource = resource.replace(p, getValue(params[p]));
						}
					}
				}

				return resource;
			}

			function getValue(resource)
			{
				return resources ? (resources[resource] || resource) : resource;
			}

			function evalMulti(key, resource, count)
			{
				var pat,
					re,
					match,
					from,
					to,
					i;

				for (pat in resource)
				{
					if (!resource.hasOwnProperty(pat))
					{
						/* istanbul ignore next */
						continue;
					}

					re = /(\d+)\s*-\s*(\d+)/;
					match = re.exec(pat);

					if (match)
					{
						from = match[1];
						to = match[2];
						if (count >= from && count <= to)
						{
							return resource[pat];
						}
					}

					re = /([<>]=?)\s*(\d+)/;
					match = re.exec(pat);

					if (match)
					{
						var op = match[1];
						var num = match[2];
						if (op === '>' && count > num)
						{
							return resource[pat];
						}
						else if (op === '>=' && count >= num)
						{
							return resource[pat];
						}
						else if (op === '<' && count < num)
						{
							return resource[pat];
						}
						else if (op === '<=' && count <= num)
						{
							return resource[pat];
						}
					}

					re = /\s*,\s*/;
					match = pat.split(re);

					if (match)
					{
						for (i = 0; i < match.length; i++)
						{
							if (count === ~~match[i])
							{
								return resource[pat];
							}
						}
					}
				}

				return key;
			}
		}

		this.resources = function(context, locale, resources)
		{
			if (!_resources[context])
			{
				_resources[context] = {};
			}

			_resources[context][locale] = resources;
		};

		this.resourceBundle = function(context, locale)
		{
			var contextResources = _resources[context];

			return new ResourceBundle(context, locale, contextResources ? contextResources[locale] : null);
		};
	}
})(this);
