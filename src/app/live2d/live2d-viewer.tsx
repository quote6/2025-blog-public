'use client'

import { useEffect, useRef, useState } from 'react'

/** PIXI Application 实例（CDN 加载，无类型包） */
interface PixiAppInstance {
	stage: { addChild: (child: unknown) => void }
	view: HTMLCanvasElement
	destroy: (opts?: { removeView?: boolean }) => void
}

/** Live2D 模型实例 */
interface Live2DModelInstance {
	anchor: { set: (x: number, y: number) => void }
	x: number
	y: number
	scale: { set: (x: number, y: number) => void }
}

const CDN_SCRIPTS = [
	'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/6.2.0/browser/pixi.min.js',
	'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
	'https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/cubism4.min.js'
]

// const MODEL_URL = '/live2d/live2d.model3.json'
const MODEL_URL = '/live2d/Sanae (Event)/object_live2d_042_501.asset.model3.json'

function loadScript(src: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			resolve()
			return
		}
		const script = document.createElement('script')
		script.src = src
		script.crossOrigin = 'anonymous'
		script.onload = () => resolve()
		script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
		document.head.appendChild(script)
	})
}

export default function Live2DViewer() {
	const containerRef = useRef<HTMLDivElement>(null)
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
	const [errorMsg, setErrorMsg] = useState<string>('')

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		let app: PixiAppInstance | null = null

		const init = async () => {
			try {
				for (const src of CDN_SCRIPTS) {
					await loadScript(src)
				}

				const PIXI = (window as unknown as { PIXI: unknown }).PIXI
				if (!PIXI) {
					throw new Error('PIXI not found on window')
				}
				;(window as unknown as { PIXI: unknown }).PIXI = PIXI

				const PIXIApp = (
					PIXI as { Application: new (opts: { view: HTMLCanvasElement; width?: number; height?: number; backgroundAlpha?: number }) => PixiAppInstance }
				).Application

				const Live2DModel = (PIXI as { live2d?: { Live2DModel: { from: (url: string) => Promise<Live2DModelInstance> } } }).live2d?.Live2DModel

				if (!Live2DModel) {
					throw new Error('PIXI.live2d.Live2DModel not found')
				}

				const width = container.clientWidth || 500
				const height = container.clientHeight || 500
				const canvas = document.createElement('canvas')
				canvas.style.width = '100%'
				canvas.style.height = '100%'
				canvas.style.display = 'block'
				container.appendChild(canvas)

				app = new PIXIApp({
					view: canvas,
					width,
					height,
					backgroundAlpha: 0
				})

				const model = await Live2DModel.from(MODEL_URL)
				app.stage.addChild(model)

				/* 针对当前使用的Live2Dm模型增加修复多个手部部件重叠显示的问题 */
				// === 修复手部重影代码 (替换原有代码) ===
				// 1. 获取模型所有的部件 ID 列表
				const parts = model.internalModel.coreModel.drawables
				// 2. 定义你希望保留显示的“白名单” ID
				const visibleHands = ['PartLeftHand01', 'PartRightHand01']
				// 3. 遍历所有部件
				for (let i = 0; i < parts.ids.length; i++) {
  					const partId = parts.ids[i]
  					// 4. 筛选逻辑：如果部件名字里包含 "Hand" (不管是左手还是右手)
  					if (partId.includes('Hand')) {
    					// 检查它是否在白名单里
    					if (!visibleHands.includes(partId)) {
      						// 如果不在白名单 (即 02, 03...07)，则强制隐藏
      						const part = model.getChildByPath(partId)
      						if (part) {
        						part.alpha = 0 // 设置透明度为 0
        						// console.log(`隐藏多余部件: ${partId}`) // 调试用
      						}
    					}
  					}
				}
				// === 修复结束 ===

				model.anchor.set(0.5, 0.5)
				model.x = width / 2
				model.y = height / 2
				model.scale.set(0.25, 0.25)

				setStatus('ready')
			} catch (err) {
				setErrorMsg(err instanceof Error ? err.message : String(err))
				setStatus('error')
			}
		}

		init()

		return () => {
			if (app !== null && typeof app === 'object' && 'destroy' in app && typeof app.destroy === 'function') {
				app.destroy({ removeView: true })
			}
			container.innerHTML = ''
		}
	}, [])

	return (
		<div className='relative aspect-square w-full overflow-hidden rounded-full'>
			<div ref={containerRef} className='absolute inset-0 h-full w-full' />
			{status === 'loading' && <div className='text-secondary absolute inset-0 flex items-center justify-center'>加载 Live2D 模型中…</div>}
			{status === 'error' && <div className='absolute inset-0 flex items-center justify-center p-4 text-center text-red-500'>{errorMsg}</div>}
		</div>
	)
}
