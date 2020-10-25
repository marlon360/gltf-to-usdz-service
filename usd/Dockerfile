
FROM python:3.7.9-slim-buster

# the release tag of the usd repository
ENV USD_VERSION="20.11"

# Update the environment path
ENV HOME="/usr/src/app"
ENV USD_BUILD_PATH="${HOME}/usd"
ENV USD_BIN_PATH="${USD_BUILD_PATH}/bin"
ENV USD_LIB_PATH="${USD_BUILD_PATH}/lib"
ENV PATH="${PATH}:${USD_BIN_PATH}"
ENV LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:${USD_LIB_PATH}"
ENV PYTHONPATH="${PYTHONPATH}:${USD_LIB_PATH}/python"

WORKDIR ${HOME}

# Required for compiling the USD source
RUN apt-get -qq update && \
    apt-get install -y git \
	build-essential \
	cmake \
	nasm \
	libglew-dev libxrandr-dev libxcursor-dev libxinerama-dev libxi-dev zlib1g-dev && \
	rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/PixarAnimationStudios/USD usdsrc && \
	cd usdsrc && git checkout tags/v${USD_VERSION} && cd ../

RUN python usdsrc/build_scripts/build_usd.py --no-usdview --build ${USD_BUILD_PATH} --src ${HOME}/USDgen/src ${HOME}/USDinst -v && \
	rm -rf usdsrc && \
	# remove build files we no longer need to save space
	rm -rf ${USD_BUILD_PATH}/build && \
	rm -rf ${USD_BUILD_PATH}/cmake && \
	rm -rf ${USD_BUILD_PATH}/pxrConfig.cmake && \
	rm -rf ${USD_BUILD_PATH}/share && \
	rm -rf ${USD_BUILD_PATH}/src

RUN apt-get purge -y git \
	build-essential \
	cmake \
	nasm \
	libglew-dev \
	libxrandr-dev \
	libxinerama-dev \
	libxi-dev \
	zlib1g-dev && \
	apt autoremove -y && \
	apt-get autoclean -y