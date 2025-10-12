from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class CategoriaInventario(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    ROPA: _ClassVar[CategoriaInventario]
    ALIMENTOS: _ClassVar[CategoriaInventario]
    JUGUETES: _ClassVar[CategoriaInventario]
    UTILES_ESCOLARES: _ClassVar[CategoriaInventario]
ROPA: CategoriaInventario
ALIMENTOS: CategoriaInventario
JUGUETES: CategoriaInventario
UTILES_ESCOLARES: CategoriaInventario

class InventarioItem(_message.Message):
    __slots__ = ("id", "categoria", "descripcion", "cantidad", "eliminado", "fechaAlta", "usuarioAlta", "fechaModificacion", "usuarioModificacion")
    ID_FIELD_NUMBER: _ClassVar[int]
    CATEGORIA_FIELD_NUMBER: _ClassVar[int]
    DESCRIPCION_FIELD_NUMBER: _ClassVar[int]
    CANTIDAD_FIELD_NUMBER: _ClassVar[int]
    ELIMINADO_FIELD_NUMBER: _ClassVar[int]
    FECHAALTA_FIELD_NUMBER: _ClassVar[int]
    USUARIOALTA_FIELD_NUMBER: _ClassVar[int]
    FECHAMODIFICACION_FIELD_NUMBER: _ClassVar[int]
    USUARIOMODIFICACION_FIELD_NUMBER: _ClassVar[int]
    id: int
    categoria: CategoriaInventario
    descripcion: str
    cantidad: int
    eliminado: bool
    fechaAlta: int
    usuarioAlta: str
    fechaModificacion: int
    usuarioModificacion: str
    def __init__(self, id: _Optional[int] = ..., categoria: _Optional[_Union[CategoriaInventario, str]] = ..., descripcion: _Optional[str] = ..., cantidad: _Optional[int] = ..., eliminado: bool = ..., fechaAlta: _Optional[int] = ..., usuarioAlta: _Optional[str] = ..., fechaModificacion: _Optional[int] = ..., usuarioModificacion: _Optional[str] = ...) -> None: ...

class CrearItemRequest(_message.Message):
    __slots__ = ("categoria", "descripcion", "cantidad", "usuarioEjecutor")
    CATEGORIA_FIELD_NUMBER: _ClassVar[int]
    DESCRIPCION_FIELD_NUMBER: _ClassVar[int]
    CANTIDAD_FIELD_NUMBER: _ClassVar[int]
    USUARIOEJECUTOR_FIELD_NUMBER: _ClassVar[int]
    categoria: CategoriaInventario
    descripcion: str
    cantidad: int
    usuarioEjecutor: str
    def __init__(self, categoria: _Optional[_Union[CategoriaInventario, str]] = ..., descripcion: _Optional[str] = ..., cantidad: _Optional[int] = ..., usuarioEjecutor: _Optional[str] = ...) -> None: ...

class ActualizarItemRequest(_message.Message):
    __slots__ = ("id", "descripcion", "cantidad", "usuarioEjecutor")
    ID_FIELD_NUMBER: _ClassVar[int]
    DESCRIPCION_FIELD_NUMBER: _ClassVar[int]
    CANTIDAD_FIELD_NUMBER: _ClassVar[int]
    USUARIOEJECUTOR_FIELD_NUMBER: _ClassVar[int]
    id: int
    descripcion: str
    cantidad: int
    usuarioEjecutor: str
    def __init__(self, id: _Optional[int] = ..., descripcion: _Optional[str] = ..., cantidad: _Optional[int] = ..., usuarioEjecutor: _Optional[str] = ...) -> None: ...

class BajaLogicaItemRequest(_message.Message):
    __slots__ = ("id", "usuarioEjecutor")
    ID_FIELD_NUMBER: _ClassVar[int]
    USUARIOEJECUTOR_FIELD_NUMBER: _ClassVar[int]
    id: int
    usuarioEjecutor: str
    def __init__(self, id: _Optional[int] = ..., usuarioEjecutor: _Optional[str] = ...) -> None: ...

class ListarItemsRequest(_message.Message):
    __slots__ = ("incluirEliminados",)
    INCLUIRELIMINADOS_FIELD_NUMBER: _ClassVar[int]
    incluirEliminados: bool
    def __init__(self, incluirEliminados: bool = ...) -> None: ...

class BuscarItemPorIdRequest(_message.Message):
    __slots__ = ("id",)
    ID_FIELD_NUMBER: _ClassVar[int]
    id: int
    def __init__(self, id: _Optional[int] = ...) -> None: ...

class RegistrarSalidaRequest(_message.Message):
    __slots__ = ("categoria", "descripcion", "cantidad", "usuarioEjecutor")
    CATEGORIA_FIELD_NUMBER: _ClassVar[int]
    DESCRIPCION_FIELD_NUMBER: _ClassVar[int]
    CANTIDAD_FIELD_NUMBER: _ClassVar[int]
    USUARIOEJECUTOR_FIELD_NUMBER: _ClassVar[int]
    categoria: CategoriaInventario
    descripcion: str
    cantidad: int
    usuarioEjecutor: str
    def __init__(self, categoria: _Optional[_Union[CategoriaInventario, str]] = ..., descripcion: _Optional[str] = ..., cantidad: _Optional[int] = ..., usuarioEjecutor: _Optional[str] = ...) -> None: ...

class ListaItemsResponse(_message.Message):
    __slots__ = ("items",)
    ITEMS_FIELD_NUMBER: _ClassVar[int]
    items: _containers.RepeatedCompositeFieldContainer[InventarioItem]
    def __init__(self, items: _Optional[_Iterable[_Union[InventarioItem, _Mapping]]] = ...) -> None: ...

class RespuestaExito(_message.Message):
    __slots__ = ("mensaje", "exito")
    MENSAJE_FIELD_NUMBER: _ClassVar[int]
    EXITO_FIELD_NUMBER: _ClassVar[int]
    mensaje: str
    exito: bool
    def __init__(self, mensaje: _Optional[str] = ..., exito: bool = ...) -> None: ...

class DonacionItem(_message.Message):
    __slots__ = ("categoria", "descripcion", "cantidad")
    CATEGORIA_FIELD_NUMBER: _ClassVar[int]
    DESCRIPCION_FIELD_NUMBER: _ClassVar[int]
    CANTIDAD_FIELD_NUMBER: _ClassVar[int]
    categoria: str
    descripcion: str
    cantidad: int
    def __init__(self, categoria: _Optional[str] = ..., descripcion: _Optional[str] = ..., cantidad: _Optional[int] = ...) -> None: ...

class SolicitarDonacionesRequest(_message.Message):
    __slots__ = ("donaciones",)
    DONACIONES_FIELD_NUMBER: _ClassVar[int]
    donaciones: _containers.RepeatedCompositeFieldContainer[DonacionItem]
    def __init__(self, donaciones: _Optional[_Iterable[_Union[DonacionItem, _Mapping]]] = ...) -> None: ...

class SolicitarDonacionesResponse(_message.Message):
    __slots__ = ("idSolicitud", "mensaje", "exito")
    IDSOLICITUD_FIELD_NUMBER: _ClassVar[int]
    MENSAJE_FIELD_NUMBER: _ClassVar[int]
    EXITO_FIELD_NUMBER: _ClassVar[int]
    idSolicitud: str
    mensaje: str
    exito: bool
    def __init__(self, idSolicitud: _Optional[str] = ..., mensaje: _Optional[str] = ..., exito: bool = ...) -> None: ...

class TransferirDonacionRequest(_message.Message):
    __slots__ = ("idSolicitud", "donaciones")
    IDSOLICITUD_FIELD_NUMBER: _ClassVar[int]
    DONACIONES_FIELD_NUMBER: _ClassVar[int]
    idSolicitud: str
    donaciones: _containers.RepeatedCompositeFieldContainer[DonacionItem]
    def __init__(self, idSolicitud: _Optional[str] = ..., donaciones: _Optional[_Iterable[_Union[DonacionItem, _Mapping]]] = ...) -> None: ...

class ListarSolicitudesExternasRequest(_message.Message):
    __slots__ = ("soloActivas",)
    SOLOACTIVAS_FIELD_NUMBER: _ClassVar[int]
    soloActivas: bool
    def __init__(self, soloActivas: bool = ...) -> None: ...

class SolicitudExterna(_message.Message):
    __slots__ = ("idSolicitud", "idOrganizacionSolicitante", "donaciones", "activa", "fechaRecepcion")
    IDSOLICITUD_FIELD_NUMBER: _ClassVar[int]
    IDORGANIZACIONSOLICITANTE_FIELD_NUMBER: _ClassVar[int]
    DONACIONES_FIELD_NUMBER: _ClassVar[int]
    ACTIVA_FIELD_NUMBER: _ClassVar[int]
    FECHARECEPCION_FIELD_NUMBER: _ClassVar[int]
    idSolicitud: str
    idOrganizacionSolicitante: int
    donaciones: _containers.RepeatedCompositeFieldContainer[DonacionItem]
    activa: bool
    fechaRecepcion: int
    def __init__(self, idSolicitud: _Optional[str] = ..., idOrganizacionSolicitante: _Optional[int] = ..., donaciones: _Optional[_Iterable[_Union[DonacionItem, _Mapping]]] = ..., activa: bool = ..., fechaRecepcion: _Optional[int] = ...) -> None: ...

class ListarSolicitudesExternasResponse(_message.Message):
    __slots__ = ("solicitudes",)
    SOLICITUDES_FIELD_NUMBER: _ClassVar[int]
    solicitudes: _containers.RepeatedCompositeFieldContainer[SolicitudExterna]
    def __init__(self, solicitudes: _Optional[_Iterable[_Union[SolicitudExterna, _Mapping]]] = ...) -> None: ...
