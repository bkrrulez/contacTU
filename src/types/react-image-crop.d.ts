
declare module 'react-image-crop' {
    import { Component, CSSProperties, ReactNode } from 'react';

    export interface Crop {
        aspect?: number;
        x: number;
        y: number;
        width: number;
        height: number;
        unit: 'px' | '%';
    }

    export interface ReactCropProps {
        crop?: Crop;
        onChange: (crop: Crop, percentCrop: Crop) => void;
        onComplete?: (crop: Crop, percentCrop: Crop) => void;
        onDragStart?: (e: PointerEvent) => void;
        onDragEnd?: (e: PointerEvent) => void;
        children?: ReactNode;
        className?: string;
        style?: CSSProperties;
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
        keepSelection?: boolean;
        disabled?: boolean;
        locked?: boolean;
        aspect?: number;
    }

    export function centerCrop(crop: Crop, imageWidth: number, imageHeight: number): Crop;
    export function makeAspectCrop(crop: Partial<Crop>, aspect: number, imageWidth: number, imageHeight: number): Crop;

    class ReactCrop extends Component<ReactCropProps> {}
    export default ReactCrop;
}
