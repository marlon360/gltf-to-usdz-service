# load usd from own container
FROM marlon360/usd:latest

WORKDIR /usr/src/ufg

# Configuration
ARG UFG_RELEASE="6d288cce8b68744494a226574ae1d7ba6a9c46eb"
ARG UFG_SRC="/usr/src/ufg"
ARG UFG_INSTALL="/usr/local/ufg"
ENV USD_DIR="/usr/src/app/USDinst"
ENV LD_LIBRARY_PATH="${USD_DIR}/lib:${UFG_SRC}/lib"
ENV PATH="${PATH}:${UFG_INSTALL}/bin"
ENV PYTHONPATH="${PYTHONPATH}:${UFG_INSTALL}/python"

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    build-essential \
	cmake \
	make \
	nasm
# Build + install usd_from_gltf
RUN git init && \
    git remote add origin https://github.com/google/usd_from_gltf.git && \
    git fetch --depth 1 origin "${UFG_RELEASE}" && \
    git checkout FETCH_HEAD && \
    python "${UFG_SRC}/tools/ufginstall/ufginstall.py" -v "${UFG_INSTALL}" "${USD_DIR}" && \
    cp -r "${UFG_SRC}/tools/ufgbatch" "${UFG_INSTALL}/python" && \
    rm -rf "${UFG_SRC}" "${UFG_INSTALL}/build" "${UFG_INSTALL}/src"

RUN mkdir /usr/app
WORKDIR /usr/app

# Start the service
ENTRYPOINT ["usd_from_gltf"]
CMD ["usd_from_gltf"]