import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null)

afterEach(cleanup)
