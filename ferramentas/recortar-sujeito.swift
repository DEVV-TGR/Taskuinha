import Foundation
import Vision
import CoreImage
import AppKit

// Recorta o sujeito principal de uma fotografia e escreve um PNG com alfa.
//
//   swift ferramentas/recortar-sujeito.swift entrada.jpg saida.png [--sem-corte]
//
// Usa a Visão do macOS — o mesmo motor do "Copiar Sujeito" do Preview.
// Precisa de macOS 14 ou mais recente; não corre em CI Linux, e não é
// suposto: é uma ferramenta de bancada para preparar imagens, não faz
// parte do build.
//
// Foi assim que se fez o public/images/esqueleto-recorte.webp. Serve para
// qualquer estátua ou objecto isolado. NÃO serve para os barris da
// fachada: barris pendurados numa parede não são um "sujeito" aos olhos do
// modelo — testado nas duas fotografias da fachada, e nas duas ele
// encontra o esqueleto em vez dos barris.
//
// Depois do recorte, converter para WebP com alfa (o PNG fica 3 a 4 vezes
// maior para o mesmo resultado).

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("uso: recortar.swift <entrada> <saida.png> [--sem-corte]\n".data(using: .utf8)!)
    exit(2)
}
let entrada = URL(fileURLWithPath: args[1])
let saida = URL(fileURLWithPath: args[2])
let cortarAoSujeito = !args.contains("--sem-corte")

let handler = VNImageRequestHandler(url: entrada, options: [:])
let pedido = VNGenerateForegroundInstanceMaskRequest()

do {
    try handler.perform([pedido])
} catch {
    FileHandle.standardError.write("falhou a análise: \(error)\n".data(using: .utf8)!)
    exit(1)
}

guard let resultado = pedido.results?.first else {
    FileHandle.standardError.write("nenhum sujeito encontrado\n".data(using: .utf8)!)
    exit(1)
}

print("instâncias encontradas: \(resultado.allInstances.count)")

do {
    let buffer = try resultado.generateMaskedImage(
        ofInstances: resultado.allInstances,
        from: handler,
        croppedToInstancesExtent: cortarAoSujeito
    )
    let ci = CIImage(cvPixelBuffer: buffer)
    let contexto = CIContext()
    guard let cg = contexto.createCGImage(ci, from: ci.extent) else {
        FileHandle.standardError.write("falhou a conversão\n".data(using: .utf8)!)
        exit(1)
    }
    let rep = NSBitmapImageRep(cgImage: cg)
    guard let png = rep.representation(using: .png, properties: [:]) else {
        FileHandle.standardError.write("falhou a codificação PNG\n".data(using: .utf8)!)
        exit(1)
    }
    try png.write(to: saida)
    print("escrito \(saida.path) — \(cg.width)x\(cg.height)")
} catch {
    FileHandle.standardError.write("falhou o recorte: \(error)\n".data(using: .utf8)!)
    exit(1)
}
