// @refresh reload
import { mount, StartClient } from '@solidjs/start/client';

const mountingPoint = document.getElementById('app')

if (!mountingPoint) {
    throw new Error('No mounting point')
}

mount(() => <StartClient />, mountingPoint);
