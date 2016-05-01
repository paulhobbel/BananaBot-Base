'use strict';

const crate = require('crate-js'),
      ContainerBuilder = crate.ContainerBuilder,
      JsonLoader = crate.JsonLoader;

module.exports = (Bot) => {
    let builder = new ContainerBuilder(),
        loader = new JsonLoader();

    loader.addJson({ parameters: require('./parameters')(Bot) });
    loader.addJson({ services: require('./core') });
    loader.addJson({ services: require('./managers') });
    loader.addJson({ services: require('./listeners') });
    loader.addJson({ services: require('./handlers') });

    builder.addLoader(loader);

    return {
        builder: builder, loader: loader
    };
}